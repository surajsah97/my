var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const ProductOrderModel = mongoose.model(constants.ProductOrderModel);
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const CartModel = mongoose.model(constants.CartModel);
const UserAddressModel = mongoose.model(constants.UserAddressModel);
const common = require("../service/commonFunction");
const ObjectId = mongoose.Types.ObjectId;
var customError = require("../middleware/customerror");
module.exports = {
  createOrder: async (req, res, next) => {
    // const { userId } = req.body;
    const checkOutdata = await ProductCheckOutModel.findOne({
      _id: req.body.checkoutId,
      activeStatus: "Active",
    }).sort({
      _id: -1,
    });
    console.log(checkOutdata, ".......checkOutData");
    if (!checkOutdata) {
      const err = new customError(
        global.CONFIGS.api.ProductCheckOutNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const userAddress = await UserAddressModel.findOne(
      { userId: checkOutdata.userId },
      { _id: -1 }
    ).sort({ _id: -1 });

    req.body.product = checkOutdata.product;
    req.body.addressId = userAddress._id;
    req.body.freeProduct = checkOutdata.freeProduct;
    req.body.totalPrice = checkOutdata.totalPrice;
    req.body.vatAmount = checkOutdata.vatAmount;
    req.body.totalTaxablePrice = checkOutdata.totalTaxablePrice;
    req.body.userId = checkOutdata.userId;
    // console.log(req.body, "......body");

    const createProductOrder = await ProductOrderModel.create(req.body);
    if (createProductOrder) {
      var update_checkout = await ProductCheckOutModel.updateOne(
        { _id: req.body.checkoutId },
        { activeStatus: "Expired" }
      );
      var delete_cart = await CartModel.deleteOne({
        userId: createProductOrder.userId,
      });
      console.log(delete_cart, ".....deleted");
      if (createProductOrder.freeProduct.length > 0) {
        var finduser = await UserModel.findOne({
          _id: createProductOrder.userId,
        });
        if (finduser && finduser.trialActive === true) {
          var trailprod = parseInt(
            createProductOrder.freeProduct.length + finduser.trialQuantity
          );
          if (trailprod >= 3) {
            var update_user = await UserModel.updateOne(
              { _id: createProductOrder.userId },
              { trialQuantity: trailprod, trialActive: false }
            );
          } else if (trailprod < 3) {
            var update_user = await UserModel.updateOne(
              { _id: createProductOrder.userId },
              { trialQuantity: trailprod }
            );
          }
        }
      }
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Orderadded,
      data: createProductOrder,
    });
  },

  getOrderByUser: async (req, res, next) => {
    // const limit = parseInt(req.query.limit) || 3; // docs in single page
    // const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    // const skip = (pageNo - 1) * limit;

    var findAllOrderList = await ProductOrderModel.aggregate([
      {
        $match: { userId: new ObjectId(req.query.userId) },
      },
      {
        $lookup: {
          from: "useraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "useraddress",
        },
      },
      {
        $unwind: "$useraddress",
      },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersDetails",
        },
      },
      {
        $unwind: "$usersDetails",
      },
      { $unset: "userId" },
      {
        $unwind: "$product",
      },
      {
        $unwind: {
          path: "$freeProduct",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "product",
          localField: "product.productId",
          foreignField: "_id",
          as: "product.productDetails",
        },
      },

      {
        $unwind: {
          path: "$product.productDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "category",
          localField: "product.productDetails.categoryId",
          foreignField: "_id",
          as: "product.productDetails.category",
        },
      },
      { $unwind: "$product.productDetails.category" },
      {
        $lookup: {
          from: "subcategory",
          localField: "product.productDetails.subCategoryId",
          foreignField: "_id",
          as: "product.productDetails.subcategory",
        },
      },
      { $unwind: "$product.productDetails.subcategory" },

      {
        $lookup: {
          from: "product",
          localField: "freeProduct.productId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "freeProduct.freeProductDetails.categoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.category",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.category",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subcategory",
          localField: "freeProduct.freeProductDetails.subCategoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.subcategory",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.subcategory",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          orderId: 1,
          totalPrice: 1,
          transactionId: 1,
          paymentstatus: 1,
          vatAmount: 1,
          // createdAt: 1,
          // updatedAt: 1,
          createdAt: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          updatedAt: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          orderMonth: {
            $dateToString: { format: "%B", date: "$createdAt" },
          },
          totalTaxablePrice: 1,
          status: 1,
          usersDetails: {
            userId: "$usersDetails._id",
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
            trialActive: "$usersDetails.trialActive",
          },
          useraddress: {
            useraddressId:"$useraddress._id",
            houseNo: "$useraddress.houseNo",
            buildingName: "$useraddress.buildingName",
            city: "$useraddress.city",
            landmark: "$useraddress.landmark",
            country: "$useraddress.country",
          },
          product: {
            _id: "$product.productDetails._id",
            // orderDate: "$createdAt",
            // deliveredDate: "$updatedAt",
            orderDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            deliveredDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
            },
            orderMonth: {
            $dateToString: { format: "%B", date: "$createdAt" },
            },
            deliverystatus:"$status",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            individualTotalPrice: {
              $multiply: [
                "$product.productDetails.productPrice",
                "$product.qty",
              ],
            },
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
            productUOM: "$product.productDetails.productUOM",
            productDes: "$product.productDetails.productDes",
            categoryName: "$product.productDetails.category.category",
            subategoryName: "$product.productDetails.subcategory.subCategory",
          },

          freeProduct: {
            _id: "$freeProduct.freeProductDetails._id",
            // orderDate: "$createdAt",
            // deliveredDate: "$updatedAt",
            orderDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            deliveredDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
            },
            orderMonth: {
            $dateToString: { format: "%B", date: "$createdAt" },
            },
            deliverystatus:"$status",
            qty: "$freeProduct.qty",
            productPrice: "$freeProduct.freeProductDetails.productPrice",
            freeProductName: "$freeProduct.freeProductDetails.productName",
            freeProductImage: "$freeProduct.freeProductDetails.productImage",
            freeProductUOM: "$freeProduct.freeProductDetails.productUOM",
            freeProductDes: "$freeProduct.freeProductDetails.productDes",
            freeProductcategoryName:
              "$freeProduct.freeProductDetails.category.category",
            freeProductsubategoryName:
              "$freeProduct.freeProductDetails.subcategory.subCategory",
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          transactionId: { $first: "$transactionId" },
          paymentstatus: { $first: "$paymentstatus" },
          status: { $first: "$status" },
          orderDate: { $first: "$createdAt" },
          orderMonth: { $first: "$orderMonth" },
          deliveredDate: { $first: "$updatedAt" },
          userDetails: { $first: "$usersDetails" },
          useraddressDetails: { $first: "$useraddress" },
          product: {
            $addToSet: "$product",
          },
          freeProduct: {
            $addToSet: "$freeProduct",
          },

          totalPrice: { $first: "$totalPrice" },
          vatAmount: { $first: "$vatAmount" },
          totalTaxablePrice: { $first: "$totalTaxablePrice" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },

      {
        $facet: {
          // metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          metadata: [{ $count: "total" }, ],
          data: [],
        },
      },
    ]);
    if (findAllOrderList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.OrderNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    // const totalPage = Math.ceil(
    //   parseInt(findAllOrderList[0].metadata[0].total) / limit
    // );
    const total = parseInt(findAllOrderList[0].metadata[0].total);
    // const dataPerPage = total - skip > limit ? limit : total - skip;
    // const totalLeftdata = total - skip - dataPerPage;
    // const rangeStart = skip === 0 ? 1 : skip + 1;
    // const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getOrderByUser,
      // rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: `total order is ${total}`,
      // totalPage: totalPage,
      // totalLeftdata: totalLeftdata,
      // dataPerPage,
      data: findAllOrderList[0].data,
    });
  },

  getOrderByUserOLd: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 3; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    // const orderDate = req.query.orderDate;
    const orderMonth = req.query.orderMonth;
    const monthMap = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    let query = {};
    // if (orderDate != undefined) {
    //   query.createdAt = { $gt: new Date(orderDate) };
    // }

    if (orderMonth !== undefined) {
      // Get the numeric value of the month
      const monthValue = monthMap[orderMonth.toLowerCase()];

      if (monthValue !== undefined) {
        // Construct query to match orders in the specified month
        const year = new Date().getFullYear(); // Assuming current year
        query.createdAt = {
          $gte: new Date(year, monthValue - 1, 1), // Start of the month
          $lte: new Date(year, monthValue, 0), // End of the month
        };
      } else {
        // Handle invalid month name
        const err = new customError(
          "Invalid month name. Please provide a valid month name.",
          global.CONFIGS.responseCode.badRequest
        );
        return next(err);
      }
    }

    var findAllOrderList = await ProductOrderModel.aggregate([
      {
        $match: { userId: new ObjectId(req.query.userId), ...query },
      },
      {
        $lookup: {
          from: "useraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "useraddress",
        },
      },
      {
        $unwind: "$useraddress",
      },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersDetails",
        },
      },
      {
        $unwind: "$usersDetails",
      },
      { $unset: "userId" },
      {
        $unwind: "$product",
      },
      {
        $unwind: {
          path: "$freeProduct",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "product",
          localField: "product.productId",
          foreignField: "_id",
          as: "product.productDetails",
        },
      },

      {
        $unwind: {
          path: "$product.productDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "category",
          localField: "product.productDetails.categoryId",
          foreignField: "_id",
          as: "product.productDetails.category",
        },
      },
      { $unwind: "$product.productDetails.category" },
      {
        $lookup: {
          from: "subcategory",
          localField: "product.productDetails.subCategoryId",
          foreignField: "_id",
          as: "product.productDetails.subcategory",
        },
      },
      { $unwind: "$product.productDetails.subcategory" },

      {
        $lookup: {
          from: "product",
          localField: "freeProduct.productId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "freeProduct.freeProductDetails.categoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.category",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.category",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subcategory",
          localField: "freeProduct.freeProductDetails.subCategoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.subcategory",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.subcategory",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          orderId: 1,
          totalPrice: 1,
          transactionId: 1,
          paymentstatus: 1,
          vatAmount: 1,
          createdAt: 1,
          updatedAt: 1,
          totalTaxablePrice: 1,
          status: 1,
          usersDetails: {
            userId: "$usersDetails._id",
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
            trialActive: "$usersDetails.trialActive",
          },
          useraddress: {
            houseNo: "$useraddress.houseNo",
            buildingName: "$useraddress.buildingName",
            city: "$useraddress.city",
            landmark: "$useraddress.landmark",
            country: "$useraddress.country",
          },
          product: {
            _id: "$product.productDetails._id",
            orderDate: "$createdAt",
            deliveredDate: "$updatedAt",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            individualTotalPrice: {
              $multiply: [
                "$product.productDetails.productPrice",
                "$product.qty",
              ],
            },
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
            productUOM: "$product.productDetails.productUOM",
            productDes: "$product.productDetails.productDes",
            categoryName: "$product.productDetails.category.category",
            subategoryName: "$product.productDetails.subcategory.subCategory",
          },

          freeProduct: {
            _id: "$freeProduct.freeProductDetails._id",
            orderDate: "$createdAt",
            deliveredDate: "$updatedAt",
            qty: "$freeProduct.qty",
            productPrice: "$freeProduct.freeProductDetails.productPrice",
            freeProductName: "$freeProduct.freeProductDetails.productName",
            freeProductImage: "$freeProduct.freeProductDetails.productImage",
            freeProductUOM: "$freeProduct.freeProductDetails.productUOM",
            freeProductDes: "$freeProduct.freeProductDetails.productDes",
            freeProductcategoryName:
              "$freeProduct.freeProductDetails.category.category",
            freeProductsubategoryName:
              "$freeProduct.freeProductDetails.subcategory.subCategory",
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          transactionId: { $first: "$transactionId" },
          paymentstatus: { $first: "$paymentstatus" },
          status: { $first: "$status" },
          orderDate: { $first: "$createdAt" },
          deliveredDate: { $first: "$updatedAt" },
          userDetails: { $first: "$usersDetails" },
          useraddressDetails: { $first: "$useraddress" },
          product: {
            $addToSet: "$product",
          },
          freeProduct: {
            $addToSet: "$freeProduct",
          },

          totalPrice: { $first: "$totalPrice" },
          vatAmount: { $first: "$vatAmount" },
          totalTaxablePrice: { $first: "$totalTaxablePrice" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);
    if (findAllOrderList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.OrderNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalPage = Math.ceil(
      parseInt(findAllOrderList[0].metadata[0].total) / limit
    );
    const total = parseInt(findAllOrderList[0].metadata[0].total);
    const dataPerPage = total - skip > limit ? limit : total - skip;
    const totalLeftdata = total - skip - dataPerPage;
    const rangeStart = skip === 0 ? 1 : skip + 1;
    const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getOrderByUser,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      data: findAllOrderList[0].data,
    });
  },

  orderListByAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    const searchText = req.query.searchText;
    var query = {};
    //  categoryName: "$product.productDetails.category.category",
            // subategoryName: "$product.productDetails.subcategory.subCategory",
    if (searchText !== undefined) {
        query = {
            $or: [
                { orderId: { $regex: new RegExp(searchText), $options: "i" } },
                { transactionId: { $regex: new RegExp(searchText), $options: "i" } },
                { "usersDetails.name": { $regex: new RegExp(searchText),$options: "i" } },
                { "usersDetails.email": { $regex: new RegExp(searchText),$options: "i" } },
                { "product.productDetails.productName": { $regex: new RegExp(searchText),$options: "i" } },
                { "product.productDetails.subcategory.subCategory": { $regex: new RegExp(searchText),$options: "i" } },
                { "useraddress.buildingName": { $regex: new RegExp(searchText),$options: "i" } },
                { "useraddress.city": { $regex: new RegExp(searchText),$options: "i" } },
                { "useraddress.landmark": { $regex: new RegExp(searchText),$options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$usersDetails.mobile" },
                            regex: searchText,
                           
                        }
                    }
                },
                
                {
                    status: {
                        $regex: new RegExp(searchText),
                        $options: "i",
                    },
                },
            ],
        };
    }


    var findAllOrderList = await ProductOrderModel.aggregate([
      {
        $lookup: {
          from: "useraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "useraddress",
        },
      },
      {
        $unwind: "$useraddress",
      },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersDetails",
        },
      },
      {
        $unwind: "$usersDetails",
      },
      { $unset: "userId" },
      {
        $unwind: "$product",
      },
      {
        $unwind: {
          path: "$freeProduct",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "product",
          localField: "product.productId",
          foreignField: "_id",
          as: "product.productDetails",
        },
      },

      {
        $unwind: {
          path: "$product.productDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "category",
          localField: "product.productDetails.categoryId",
          foreignField: "_id",
          as: "product.productDetails.category",
        },
      },
      { $unwind: "$product.productDetails.category" },
      {
        $lookup: {
          from: "subcategory",
          localField: "product.productDetails.subCategoryId",
          foreignField: "_id",
          as: "product.productDetails.subcategory",
        },
      },
      { $unwind: "$product.productDetails.subcategory" },

      {
        $lookup: {
          from: "product",
          localField: "freeProduct.productId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "freeProduct.freeProductDetails.categoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.category",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.category",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subcategory",
          localField: "freeProduct.freeProductDetails.subCategoryId",
          foreignField: "_id",
          as: "freeProduct.freeProductDetails.subcategory",
        },
      },
      {
        $unwind: {
          path: "$freeProduct.freeProductDetails.subcategory",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: query,
      },

      {
        $project: {
          _id: 1,
          orderId: 1,
          totalPrice: 1,
          transactionId: 1,
          paymentstatus: 1,
          vatAmount: 1,
          totalTaxablePrice: 1,
          status: 1,
          usersDetails: {
            userId: "$usersDetails._id",
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
          },
          useraddress: {
            houseNo: "$useraddress.houseNo",
            buildingName: "$useraddress.buildingName",
            city: "$useraddress.city",
            landmark: "$useraddress.landmark",
            country: "$useraddress.country",
          },
          product: {
            _id: "$product.productDetails._id",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            individualTotalPrice: {
              $multiply: [
                "$product.productDetails.productPrice",
                "$product.qty",
              ],
            },
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
            productUOM: "$product.productDetails.productUOM",
            productDes: "$product.productDetails.productDes",
            categoryName: "$product.productDetails.category.category",
            subategoryName: "$product.productDetails.subcategory.subCategory",
          },

          freeProduct: {
            _id: "$freeProduct.freeProductDetails._id",
            qty: "$freeProduct.qty",
            productPrice: "$freeProduct.freeProductDetails.productPrice",
            freeProductName: "$freeProduct.freeProductDetails.productName",
            freeProductImage: "$freeProduct.freeProductDetails.productImage",
            freeProductUOM: "$freeProduct.freeProductDetails.productUOM",
            freeProductDes: "$freeProduct.freeProductDetails.productDes",
            freeProductcategoryName:
              "$freeProduct.freeProductDetails.category.category",
            freeProductsubategoryName:
              "$freeProduct.freeProductDetails.subcategory.subCategory",
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          transactionId: { $first: "$transactionId" },
          paymentstatus: { $first: "$paymentstatus" },
          status: { $first: "$status" },
          userDetails: { $first: "$usersDetails" },
          useraddressDetails: { $first: "$useraddress" },
          product: {
            $addToSet: "$product",
          },
          freeProduct: {
            $addToSet: "$freeProduct",
          },

          totalPrice: { $first: "$totalPrice" },
          vatAmount: { $first: "$vatAmount" },
          totalTaxablePrice: { $first: "$totalTaxablePrice" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);
    if (findAllOrderList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.OrderNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalPage = Math.ceil(
      parseInt(findAllOrderList[0].metadata[0].total) / limit
    );
    const total = parseInt(findAllOrderList[0].metadata[0].total);
    const dataPerPage = total - skip > limit ? limit : total - skip;
    const totalLeftdata = total - skip - dataPerPage;
    const rangeStart = skip === 0 ? 1 : skip + 1;
    const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allOrderlistAdmin,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      data: findAllOrderList[0].data,
    });
  },

  /** test api*/
  createTest: async (req, res) => {
    try {
      const { heading, description } = req.body;
      const testData = req.body;

      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Productadded,
        data: testData,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};