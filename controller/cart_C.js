var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CartModel = mongoose.model(constants.CartModel);
const UserModel = mongoose.model(constants.UserModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  addTpCart: async (req, res, next) => {
    var find_user = await UserModel.findOne({ _id: req.body.userId });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var find_cart = await CartModel.findOne({ userId: req.body.userId });
    if (find_cart) {
      var prodincart = find_cart.product.some(
        (item) => item.productId == req.body.product[0].productId
      );

      if (prodincart === true) {
        var find_prod = await ProductModel.findOne({
          _id: req.body.product[0].productId,
        });
        if (!find_prod) {
          const err = new customError(
            global.CONFIGS.api.ProductNotfound,
            global.CONFIGS.responseCode.notFound
          );
          return next(err);
        }
        var price = find_prod.productPrice * req.body.product[0].qty;
        var finalPrice = price + find_cart.price;
        var myArray = find_cart.product;
        var objIndex = myArray.findIndex(
          (obj) => obj.productId == req.body.product[0].productId
        );
        myArray[objIndex].qty = myArray[objIndex].qty + req.body.product[0].qty;
        var totalProduct = myArray;
        // return res.send(totalProduct)
        var update_cart = await CartModel.updateOne(
          { _id: find_cart._id },
          {
            product: totalProduct,
            price: finalPrice,
          }
        );
      } else {
        var find_prod = await ProductModel.findOne({
          _id: req.body.product[0].productId,
        });
        if (!find_prod) {
          const err = new customError(
            global.CONFIGS.api.ProductNotfound,
            global.CONFIGS.responseCode.notFound
          );
          return next(err);
        }
        var price = find_prod.productPrice * req.body.product[0].qty;
        var finalPrice = price + find_cart.price;
        var totalProduct = [...find_cart.product, ...req.body.product];
        var update_cart = await CartModel.updateOne(
          { _id: find_cart._id },
          {
            product: totalProduct,
            price: finalPrice,
          }
        );
      }
      var get_cart = await CartModel.findOne({ _id: find_cart._id });
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Cartadded,
        data: get_cart,
      });
    } else if (!find_cart) {
      var find_prod = await ProductModel.findOne({
        _id: req.body.product[0].productId,
      });
      if (!find_prod) {
        const err = new customError(
          global.CONFIGS.api.ProductNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      var price = find_prod.productPrice * req.body.product[0].qty;
      var create_cart = await CartModel.create({
        userId: req.body.userId,
        product: req.body.product,
        price: price,
      });
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Cartadded,
        data: create_cart,
      });

      // }
    }
  },
  updateCart: async (req, res, next) => {
    var find_user = await UserModel.findOne({ _id: req.body.userId });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var find_cart = await CartModel.findOne({ userId: req.body.userId });
    if (find_cart) {
      var prodincart = find_cart.product.some(
        (item) => item.productId == req.body.productId
      );

      if (prodincart === true) {
        var find_prod = await ProductModel.findOne({
          _id: req.body.productId,
        });
        if (!find_prod) {
          const err = new customError(
            global.CONFIGS.api.ProductNotfound,
            global.CONFIGS.responseCode.notFound
          );
          return next(err);
        }
        var myArray = find_cart.product;
        var objIndex = myArray.findIndex(
          (obj) => obj.productId == req.body.productId
        );
        console.log(objIndex, " = objIndex");
        myArray[objIndex].qty = myArray[objIndex].qty + req.body.qty;
        if (myArray[objIndex].qty === 0) {
          myArray.splice(objIndex, 1);
          var totalProduct = myArray;
          var price = find_prod.productPrice * req.body.qty;
          var finalPrice = price + find_cart.price;
        } else if (myArray[objIndex].qty > 0) {
          var totalProduct = myArray;
          var price = find_prod.productPrice * req.body.qty;
          var finalPrice = price + find_cart.price;
          // var myArray = find_cart.product;
        }

        // return res.send(totalProduct)
        var update_cart = await CartModel.updateOne(
          { _id: find_cart._id },
          {
            product: totalProduct,
            price: finalPrice,
          }
        );
      }
      var get_cart = await CartModel.findOne({ _id: find_cart._id });
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.CartUpdated,
        data: get_cart,
      });
    }
  },

  getCartByuser: async (req, res, next) => {
    var findAllCartList = await CartModel.aggregate([
      {
        $match: {
          activeStatus: "Active",
          userId: new ObjectId(req.query.userId),
        },
      },
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
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "product",
          localField: "product.productId",
          foreignField: "_id",
          as: "product.productDetails",
        },
      },
      { $unwind: "$product.productDetails" },

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
        $project: {
          _id: 1,
          //   _id: "$_id",
          price: 1,
          // "price": "$price",
          usersDetails: {
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
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
        },
      },
      {
        $group: {
          _id: "$_id",
          totalPrice: { $first: "$price" },
          userDetails: { $first: "$usersDetails" },
          product: {
            $push: "$product",
          },
        },
      },
      { $unset: "userId" },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (findAllCartList.length == 0) {
      const err = new customError(
        global.CONFIGS.api.CartNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getCartByUser,
      data: findAllCartList,
    });
  },
  cartListByAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var findAllCartList = await CartModel.aggregate([
      {
        $match: { activeStatus: "Active" },
      },
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
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "product",
          localField: "product.productId",
          foreignField: "_id",
          as: "product.productDetails",
        },
      },
      { $unwind: "$product.productDetails" },

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
        $project: {
          _id: 1,
          price: 1,
          usersDetails: {
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
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
        },
      },
      {
        $group: {
          _id: "$_id",
          totalPrice: { $first: "$price" },
          userDetails: { $first: "$usersDetails" },
          product: {
            $push: "$product",
          },
        },
      },
      { $unset: "userId" },
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
    if (findAllCartList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.CartNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalPage = Math.ceil(
      parseInt(findAllCartList[0].metadata[0].total) / limit
    );
    const total = parseInt(findAllCartList[0].metadata[0].total);
    const dataPerPage = total - skip > limit ? limit : total - skip;
    const totalLeftdata = total - skip - dataPerPage;
    const rangeStart = skip === 0 ? 1 : skip + 1;
    const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allCartlistAdmin,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      data: findAllCartList[0].data,
    });
  },
};
