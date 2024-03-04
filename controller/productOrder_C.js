var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductOrderModel = mongoose.model(constants.ProductOrderModel);
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const UserAddressModel = mongoose.model(constants.UserAddressModel);
const common = require("../service/commonFunction");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { userId } = req.body;
      console.log(userId, ".........userId");
      const checkOutdata = await ProductCheckOutModel.findOne({ userId }).sort({
        _id: -1,
      });
      //   console.log(checkOutdata, ".......checkOutData");
      const product = checkOutdata.product;
      //   console.log(product, "........product");
      const totalPrice = checkOutdata.totalPrice;
      //   console.log(totalPrice, "...........totalPrice");

      const userAddress = await UserAddressModel.findOne(
        { userId },
        { _id: -1 }
      ).sort({ _id: -1 });
      //   console.log(userAddress, "........userAddress");
      req.body.product = product;
      req.body.addressId = userAddress._id;
      req.body.totalPrice = totalPrice;
      console.log(req.body, "......body");
      const createProductOrder = await ProductOrderModel.create(req.body);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Productadded,
        data: createProductOrder,
      });
      p;
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** */
  //  orderListByAdmin: async (req, res, next) => {
  //   var findAllOrder = await ProductOrderModel.find().sort({ _id: -1 });
  //   var totalOrder = findAllOrder.length;
  //   return res.status(global.CONFIGS.responseCode.success).json({
  //     success: true,
  //     message: global.CONFIGS.api.alltrialuserslistAdmin,
  //     totalOrder,
  //     data: findAllOrder,
  //   });
  // },

  /**  second suraj*/
  orderListByAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

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
       "$project": {
    "_id": 1,
    "orderId": 1,
    // "usersDetails": 1,
    "usersDetails": {
        "name":"$usersDetails.name",
        "email":"$usersDetails.email",
        "mobile":"$usersDetails.mobile",
    },
    "useraddress": {
        "houseNo":"$useraddress.houseNo",
        "buildingName":"$useraddress.buildingName",
        "city":"$useraddress.city",
        "landmark":"$useraddress.landmark",
        "country":"$useraddress.country",
    },
    "product": {
      "_id":"$product.productDetails._id",
      "quantity":"$product.quantity",
      "productName":"$product.productDetails.productName",
      "productImage":"$product.productDetails.productImage",
      "productPrice":"$product.productDetails.productPrice",
      "productUOM":"$product.productDetails.productUOM",
      "productDes":"$product.productDetails.productDes",
        "categoryName": "$product.productDetails.category.category",
      "subategoryName": "$product.productDetails.subcategory.subCategory",
    }
  },
  
      },
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          userDetails: { $first: "$usersDetails" },
          useraddressDetails: { $first: "$useraddress" },
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
    if (findAllOrderList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
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
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      data: findAllOrderList[0].data,
    });
  },


  /**  firstsuraj*/
//   orderListByAdmin: async (req, res, next) => {
//     const limit = parseInt(req.query.limit) || 20; // docs in single page
//     const pageNo = parseInt(req.query.pageNo) || 1; //  page number
//     const skip = (pageNo - 1) * limit;

//     var findAllOrderList = await ProductOrderModel.aggregate([
//       {
//         $lookup: {
//           from: "useraddress",
//           localField: "addressId",
//           foreignField: "_id",
//           as: "useraddress",
//         },
//       },
//       {
//         $unwind: "$useraddress",
//       },
//       { $unset: "addressId" },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "usersDetails",
//         },
//       },
//       {
//         $unwind: "$usersDetails",
//       },
//       {
//         $unwind: "$product",
//       },
//       {
//         $lookup: {
//           from: "product",
//           localField: "product.productId",
//           foreignField: "_id",
//           as: "product.productDetails",
//         },
//       },
//       { $unwind: "$product.productDetails" },

//       {
//         $lookup: {
//           from: "category",
//           localField: "product.productDetails.categoryId",
//           foreignField: "_id",
//           as: "product.productDetails.category",
//         },
//       },
//       { $unwind: "$product.productDetails.category" },
//       {
//         $lookup: {
//           from: "subcategory",
//           localField: "product.productDetails.subCategoryId",
//           foreignField: "_id",
//           as: "product.productDetails.subcategory",
//         },
//       },
//       { $unwind: "$product.productDetails.subcategory" },

//       {
//         $group: {
//           _id: "$_id",
//           orderId: { $first: "$orderId" },
//           userDetails: { $first: "$usersDetails" },
//           useraddressDetails: { $first: "$useraddress" },
//           product: {
//             $push: "$product",
//           },
//         },
//       },
//       { $unset: "userId" },
//       {
//         $sort: {
//           _id: 1,
//         },
//       },

//       {
//         $facet: {
//           metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
//           data: [{ $skip: skip }, { $limit: limit }],
//         },
//       },
//     ]);
//     if (findAllOrderList[0].data.length == 0) {
//       const err = new customError(
//         global.CONFIGS.api.ProductNotfound,
//         global.CONFIGS.responseCode.notFound
//       );
//       return next(err);
//     }
//     const totalPage = Math.ceil(
//       parseInt(findAllOrderList[0].metadata[0].total) / limit
//     );
//     const total = parseInt(findAllOrderList[0].metadata[0].total);
//     const dataPerPage = total - skip > limit ? limit : total - skip;
//     const totalLeftdata = total - skip - dataPerPage;
//     const rangeStart = skip === 0 ? 1 : skip + 1;
//     const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

//     return res.status(global.CONFIGS.responseCode.success).json({
//       success: true,
//       message: global.CONFIGS.api.alltrialuserslistAdmin,
//       rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
//       totalData: total,
//       totalPage: totalPage,
//       totalLeftdata: totalLeftdata,
//       dataPerPage,
//       data: findAllOrderList[0].data,
//     });
//   },

  /** suraj*/
  // orderListByAdmin: async (req, res, next) => {
  //   const limit = parseInt(req.query.limit) || 20; // docs in single page
  //   const pageNo = parseInt(req.query.pageNo) || 1; //  page number
  //   const skip = (pageNo - 1) * limit;

  //   var findAllOrderList = await ProductOrderModel.aggregate([
  //     {
  //       $lookup: {
  //         from: "useraddress",
  //         localField: "addressId",
  //         foreignField: "_id",
  //         as: "useraddress",
  //       },
  //     },
  //     {
  //       $unwind: "$useraddress",
  //     },
  //     { $unset: "addressId" },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "usersDetails",
  //       },
  //     },
  //     {
  //       $unwind: "$usersDetails",
  //     },
  //     {
  //       $unwind: "$product",
  //     },
  //     {
  //       $lookup: {
  //         from: "product",
  //         localField: "product.productId",
  //         foreignField: "_id",
  //         as: "product.productId",
  //       },
  //     },
  //     { $unwind: "$product.productId" },

  //     {
  //       $group: {
  //         _id: "$_id",
  //         orderId: { $first: "$orderId" },
  //         userDetails: { $first: "$usersDetails" },
  //         useraddressDetails: { $first: "$useraddress" },
  //         product: {
  //           $push: "$product",
  //         },
  //       },
  //     },
  //     { $unset: "userId" },
  //     {
  //       $sort: {
  //         _id: 1,
  //       },
  //     },
  //   //   {
  //   //     $project: {
  //   //       _id: "$_id",
  //   //       orderId: "$orderId",
  //   //       transactionId: "$transactionId",
  //   //       paymentstatus: "$paymentstatus",
  //   //       totalPrice: "$totalPrice",
  //   //       createdAt: "$createdAt",
  //   //       updatedAt: "$updatedAt",
  //   //       /**product Array */
  //   //       product: "$product",
  //   //       /**userDetails */
  //   //     //   useraddressDetails:"$useraddressDetails",
  //   //     //   userDetails: "$userDetails",
  //   //       userDetails: {
  //   //         mobileNumber: "$usersDetails.mobile",
  //   //         name: "$usersDetails.name",
  //   //         email: "$usersDetails.email",
  //   //       },
  //   //     },
  //   //   },
  //     {
  //       $facet: {
  //         metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
  //         data: [{ $skip: skip }, { $limit: limit }],
  //       },
  //     },
  //   ]);
  //   if (findAllOrderList[0].data.length == 0) {
  //     const err = new customError(
  //       global.CONFIGS.api.ProductNotfound,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }
  //   const totalPage = Math.ceil(
  //     parseInt(findAllOrderList[0].metadata[0].total) / limit
  //   );
  //   const total = parseInt(findAllOrderList[0].metadata[0].total);
  //   const dataPerPage = total - skip > limit ? limit : total - skip;
  //   const totalLeftdata = total - skip - dataPerPage;
  //   const rangeStart = skip === 0 ? 1 : skip + 1;
  //   const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

  //   return res.status(global.CONFIGS.responseCode.success).json({
  //     success: true,
  //     message: global.CONFIGS.api.alltrialuserslistAdmin,
  //     rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
  //     totalData: total,
  //     totalPage: totalPage,
  //     totalLeftdata: totalLeftdata,
  //     dataPerPage,
  //     data: findAllOrderList[0].data,
  //   });
  // },

  /** Prakash*/
  //   orderListByAdmin: async (req, res, next) => {
  //     const limit = parseInt(req.query.limit) || 20; // docs in single page
  //     const pageNo = parseInt(req.query.pageNo) || 1; //  page number
  //     const skip = (pageNo - 1) * limit;

  //     var findAllOrderList = await ProductOrderModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "useraddress",
  //           localField: "addressId",
  //           foreignField: "_id",
  //           as: "useraddress",
  //         },
  //       },
  //       {
  //         $unwind: "$useraddress",
  //       },
  //       { $unset: "addressId" },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "userId",
  //           foreignField: "_id",
  //           as: "usersDetails",
  //         },
  //       },
  //       {
  //         $unwind: "$usersDetails",
  //       },
  //       { $unset: "userId" },

  //       {
  //         $lookup: {
  //           from: "product",
  //           localField: "product.productId",
  //           foreignField: "_id",
  //           as: "productDetails",
  //         },
  //       },
  //       { $unset: "product.productId" },

  //       {
  //         $lookup: {
  //           from: "category",
  //           localField: "productDetails.categoryId",
  //           foreignField: "_id",
  //           as: "categoryName",
  //         },
  //       },

  //       //   { $unset: "productDetails.categoryId" },
  //       //   {
  //       //     $lookup: {
  //       //       from: "subcategory",
  //       //       localField: "productDetails.subCategoryId",
  //       //       foreignField: "_id",
  //       //       as: "subcategoryName",
  //       //     },
  //       //   },
  //       //   { $unset: "productDetails.subCategoryId" },
  //       {
  //         $sort: {
  //           _id: -1,
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: "$_id",
  //           orderId: "$orderId",
  //           transactionId: "$transactionId",
  //           paymentstatus: "$paymentstatus",
  //           totalPrice: "$totalPrice",
  //           createdAt: "$createdAt",
  //           updatedAt: "$updatedAt",
  //           /** */
  //           productDetails: {
  //             $map: {
  //               input: "$productDetails",
  //               as: "proDet",
  //               in: {
  //                 $mergeObjects: [
  //                   "$$proDet",
  //                   {
  //                     $arrayElemAt: [
  //                       "$categoryName",
  //                       {
  //                         $indexOfArray: [
  //                           "$categoryName._id",
  //                           "$$proDet.categoryId",
  //                         ],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             },
  //           },

  //           //     /** */
  //           products: {
  //             $map: {
  //               input: "$product",
  //               as: "p",
  //               in: {
  //                 $mergeObjects: [
  //                   "$$p",
  //                   {
  //                     $arrayElemAt: [
  //                       "$productDetails",
  //                       {
  //                         $indexOfArray: ["$productDetails._id", "$$p.productId"],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             },
  //           },

  //           useraddressDetails: {
  //             houseNo: "$useraddress.houseNo",
  //             buildingName: "$useraddress.buildingName",
  //             city: "$useraddress.city",
  //             landmark: "$useraddress.landmark",
  //             country: "$useraddress.country",
  //           },
  //           userDetails: {
  //             mobileNumber: "$usersDetails.mobile",
  //             name: "$usersDetails.name",
  //             email: "$usersDetails.email",
  //           },
  //           categoryName: "$categoryName",
  //         },
  //       },

  //       {
  //         $facet: {
  //           metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
  //           data: [{ $skip: skip }, { $limit: limit }],
  //         },
  //       },
  //     ]);
  //     if (findAllOrderList[0].data.length == 0) {
  //       const err = new customError(
  //         global.CONFIGS.api.ProductNotfound,
  //         global.CONFIGS.responseCode.notFound
  //       );
  //       return next(err);
  //     }
  //     const totalPage = Math.ceil(
  //       parseInt(findAllOrderList[0].metadata[0].total) / limit
  //     );
  //     const total = parseInt(findAllOrderList[0].metadata[0].total);
  //     const dataPerPage = total - skip > limit ? limit : total - skip;
  //     const totalLeftdata = total - skip - dataPerPage;
  //     const rangeStart = skip === 0 ? 1 : skip + 1;
  //     const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

  //     return res.status(global.CONFIGS.responseCode.success).json({
  //       success: true,
  //       message: global.CONFIGS.api.alltrialuserslistAdmin,
  //       rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
  //       totalData: total,
  //       totalPage: totalPage,
  //       totalLeftdata: totalLeftdata,
  //       dataPerPage,
  //       data: findAllOrderList[0].data,
  //     });
  //   },

  /**  this is little helpfull*/
  //   orderListByAdmin: async (req, res, next) => {
  //     const limit = parseInt(req.query.limit) || 20; // docs in single page
  //     const pageNo = parseInt(req.query.pageNo) || 1; //  page number
  //     const skip = (pageNo - 1) * limit;

  //     var findAllOrderList = await ProductOrderModel.aggregate([
  //         {
  //             $lookup: {
  //                 from: "useraddress",
  //                 localField: "addressId",
  //                 foreignField: "_id",
  //                 as: "useraddress",
  //             },
  //         },
  //         {
  //             $unwind: "$useraddress",
  //         },
  //         { $unset: "addressId" },
  //         {
  //             $lookup: {
  //                 from: "users",
  //                 localField: "userId",
  //                 foreignField: "_id",
  //                 as: "usersDetails",
  //             },
  //         },
  //         {
  //             $unwind: "$usersDetails",
  //         },
  //         { $unset: "userId" },

  //         {
  //             $lookup: {
  //                 from: "product",
  //                 localField: "product.productId",
  //                 foreignField: "_id",
  //                 as: "productDetails",
  //             },
  //         },
  //         {
  //             $lookup: {
  //                 from: "category",
  //                 localField: "productDetails.categoryId",
  //                 foreignField: "_id",
  //                 as: "categoryName",
  //             },
  //         },
  //         {
  //             $addFields: {
  //                 "productDetails.categoryName": { $arrayElemAt: ["$categoryName.category", 0] }
  //             }
  //         },
  //         { $unset: "categoryName" },
  //         {
  //             $addFields: {
  //                 product: {
  //                     $map: {
  //                         input: "$productDetails",
  //                         as: "productDetail",
  //                         in: {
  //                             $mergeObjects: [
  //                                 "$$productDetail",
  //                                 {
  //                                     categoryName: "$$productDetail.categoryName"
  //                                 }
  //                             ]
  //                         }
  //                     }
  //                 }
  //             }
  //         },
  //         { $unset: "productDetails" },
  //         {
  //             $sort: {
  //                 _id: -1,
  //             },
  //         },
  //         {
  //             $facet: {
  //                 metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
  //                 data: [{ $skip: skip }, { $limit: limit }],
  //             },
  //         },
  //     ]);
  //     if (findAllOrderList[0].data.length == 0) {
  //         const err = new customError(
  //             global.CONFIGS.api.ProductNotfound,
  //             global.CONFIGS.responseCode.notFound
  //         );
  //         return next(err);
  //     }
  //     const totalPage = Math.ceil(
  //         parseInt(findAllOrderList[0].metadata[0].total) / limit
  //     );
  //     const total = parseInt(findAllOrderList[0].metadata[0].total);
  //     const dataPerPage = total - skip > limit ? limit : total - skip;
  //     const totalLeftdata = total - skip - dataPerPage;
  //     const rangeStart = skip === 0 ? 1 : skip + 1;
  //     const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;

  //     return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.alltrialuserslistAdmin,
  //         rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
  //         totalData: total,
  //         totalPage: totalPage,
  //         totalLeftdata: totalLeftdata,
  //         dataPerPage,
  //         data: findAllOrderList[0].data,
  //     });
  // },

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
