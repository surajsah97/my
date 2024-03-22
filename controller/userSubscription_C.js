var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserSubscriptionModel = mongoose.model(constants.UserSubscriptionModel);
const common = require("../service/commonFunction");
const ObjectId = mongoose.Types.ObjectId;
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const ProductModel = mongoose.model(constants.ProductModel);
var customError = require("../middleware/customerror");
const UserModel = mongoose.model(constants.UserModel);
const SubscriptionCheckOutModel = mongoose.model(
  constants.SubscriptionCheckOutModel
);

module.exports = {
 addSub: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const userDetail = await UserModel.findOne({ _id: userId });
      if (!userDetail) {
        const err = new customError(
          global.CONFIGS.api.userNotFound,
          global.CONFIGS.responseCode.notFound
        );  
        return next(err);
      }

      const subscriptioncheckOutdata = await SubscriptionCheckOutModel.findOne({
        _id: req.body.subscriptionCheckoutId,
        activeStatus: "Active",
      }).sort({
        _id: -1,
      });
      console.log(subscriptioncheckOutdata, ".......checkOutData");
      if (!subscriptioncheckOutdata) {
        const err = new customError(
          global.CONFIGS.api.SubscriptionCheckOutNotFound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }

      var find_subscription = await UserSubscriptionModel.findOne({
        userId: userId,
        "product.productId": subscriptioncheckOutdata.product[0].productId,
      }).sort({ _id: -1 });
      console.log(find_subscription, ".....find_subscription");
      console.log(subscriptioncheckOutdata.product[0].productId, "......222");
      if (find_subscription) {
        var prodinsubscription =
          find_subscription.product[0].productId.toString() ==
          subscriptioncheckOutdata.product[0].productId.toString();
        console.log(prodinsubscription);
        if (prodinsubscription === true) {
          /** */
          const err = new customError(
            global.CONFIGS.api.subscriptionalreadyadded,
            global.CONFIGS.responseCode.alreadyExist
          );
          return next(err);
          /** */
        }
      }
      let addSubscription = {};
      const vat = 5;
      addSubscription.vatAmount = Math.round(
        subscriptioncheckOutdata.vatAmount
      );
      addSubscription.totalPrice = Math.round(
        subscriptioncheckOutdata.totalPrice
      );
      addSubscription.product = subscriptioncheckOutdata.product;
      addSubscription.startDate = subscriptioncheckOutdata.startDate;
      addSubscription.endDate = subscriptioncheckOutdata.endDate;
      addSubscription.leftDuration = subscriptioncheckOutdata.leftDuration;
      addSubscription.dailyInterval = subscriptioncheckOutdata.dailyInterval;
      addSubscription.calendar = subscriptioncheckOutdata.calendar;
      addSubscription.subDurationId = subscriptioncheckOutdata.subDurationId;
      addSubscription.totalTaxablePrice = Math.round(
        subscriptioncheckOutdata.totalTaxablePrice
      );
      addSubscription.userId = userId;
      const subscription = await UserSubscriptionModel.create(addSubscription);

      if (subscription) {
        var update_checkout = await SubscriptionCheckOutModel.findOneAndUpdate(
          { _id: req.body.subscriptionCheckoutId },
          { activeStatus: "Expired" }
        ).sort({ _id: -1 });
        let userdata = {
          name: userDetail.name,
          email: userDetail.email,
          mobile: userDetail.mobile,
          isVerified: userDetail.isVerified,
          userType: userDetail.userType,
          activeStatus: userDetail.activeStatus,
        };

        return res.status(global.CONFIGS.responseCode.success).json({
          success: true,
          message: global.CONFIGS.api.subscriptionadded,
          data: subscription,
          userdata: userdata,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(global.CONFIGS.responseCode.exception).json({
        success: false,
        message: error.message,
      });
    }
  },



  
 
  /** */
  // addSubOld: async (req, res, next) => {
  //   try {
  //     const { userId } = req.body;
  //     const userDetail=await UserModel.findOne({_id:userId})
  //     if (!userDetail) {
  //       const err = new customError(
  //       global.CONFIGS.api.userNotFound,
  //       global.CONFIGS.responseCode.notFound
  //       );
  //       return next(err);
  //     }
  //     var find_subscription = await UserSubscriptionModel.find({
  //       userId: userId,
  //     }).sort({ _id: -1 });
  //     console.log(find_subscription, ".....find_subscription");
  //     if (find_subscription) {
  //       var prodinsubscription = find_subscription.some((item) => item.product[0].productId == req.body.product[0].productId);
  //       console.log(prodinsubscription);
  //       if (prodinsubscription === true) {
  //           const err = new customError(
  //             global.CONFIGS.api.subscriptionalreadyadded,
  //             global.CONFIGS.responseCode.alreadyExist
  //           );
  //           return next(err);
  //       }
  //     }

  //     const subDuration = await subscriptionPlanModel
  //       .findById({ _id: new ObjectId(req.body.subDurationId) })
  //       .select("planDuration");
  //     console.log(subDuration, "............subduration");
  //     if (!subDuration) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Subscription duration not found.",
  //       });
  //     }

  //     // const startDate = new Date();
  //     // startDate.setDate(startDate.getDate() + 1); // Tommorow
  //     // const endDate = new Date(
  //     //   startDate.getTime() + subDuration.planDuration * 24 * 60 * 60 * 1000
  //     // ); // 15 days after tomorrow
  //     const startDate = new Date();
  //     startDate.setDate(startDate.getDate() + 1); // Tomorrow
  //     let endDate = new Date(startDate.getTime());
  //     endDate.setDate(endDate.getDate() + subDuration.planDuration); // 15 days after tomorrow
  //     console.log(startDate, "...currentDate...");
  //     console.log(endDate, "....eeeeeee");

  //     const differenceInMilliseconds = endDate - startDate;
  //     const differenceInDays = Math.floor(
  //       differenceInMilliseconds / (1000 * 60 * 60 * 24)
  //     );
  //     const calendarItem = [];

  //     for (let i = 1; i <= differenceInDays; i++) {
  //       let obj = {};
  //       obj.productId = req.body.product[0].productId;
  //       obj.day = i;
  //       calendarItem.push(obj);
  //     }
  //     console.log(calendarItem, "....calendarItem");

  //     // console.log("Difference in days:", differenceInDays);
  //     // return;
  //     const productDetails = await ProductModel.find({
  //       _id: { $in: req.body.product[0].productId },
  //     });
  //     console.log(productDetails);
  //     let productPrice = {};
  //     productDetails.map((el) => {
  //       productPrice = el.productPrice;
  //     });
  //     console.log(productPrice, "...productPrice...");

  //     const totalSubPrice =
  //       productPrice * req.body.product[0].qty * subDuration.planDuration;
  //     console.log(totalSubPrice, "....totalSubPrice");
  //     let addSubscription = {};
  //     const vat = 5;
  //     const taxAmount = totalSubPrice * (vat / 100);
  //     const totalTaxablePrice = totalSubPrice + taxAmount;
  //     addSubscription.vatAmount = Math.round(taxAmount);
  //     addSubscription.totalPrice = Math.round(totalSubPrice);
  //     addSubscription.product = req.body.product;
  //     addSubscription.startDate = startDate;
  //     addSubscription.endDate = endDate;
  //     addSubscription.leftDuration = differenceInDays;
  //     addSubscription.calendar = calendarItem;
  //     addSubscription.subDurationId = req.body.subDurationId;
  //     addSubscription.totalTaxablePrice = Math.round(totalTaxablePrice);
  //     addSubscription.userId = userId;
  //     const subscription = await UserSubscriptionModel.create(addSubscription);

  //   if (subscription) {
  //     var update_checkout = await SubscriptionCheckOutModel.findOneAndUpdate(
  //       { userId: userId },
  //       { activeStatus: "Expired" }
  //     ).sort({_id:-1});
  //       let userdata = {
  //         name: userDetail.name,
  //         email: userDetail.email,
  //         mobile: userDetail.mobile,
  //         isVerified: userDetail.isVerified,
  //         userType: userDetail.userType,
  //         activeStatus: userDetail.activeStatus,
  //       };

  //       return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.subscriptionadded,
  //         data: subscription,
  //         userdata: userdata,
  //       });
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     res.status(global.CONFIGS.responseCode.exception).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // },

  /** */
  deletesub: async (req, res, next) => {
    const existingSubscription = await UserSubscriptionModel.findById(
      req.params.id
    );
    if (!existingSubscription) {
      const err = new customError(
        global.CONFIGS.api.subscriptionNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var delete_subscription = await UserSubscriptionModel.deleteOne({
      _id: req.params.id,
    });
    if (delete_subscription.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.alreadyExist).json({
      success: true,
      message: global.CONFIGS.api.subscriptionDelete,
    });
  },

  subscriptionListByAdmin: async (req, res, next) => {
     const find_subscription = await UserSubscriptionModel.aggregate([
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
        $lookup: {
          from: "subscriptionplan",
          localField: "subDurationId",
          foreignField: "_id",
          as: "subscriptionPlanDetails",
        },
      },
      {
        $unwind: "$subscriptionPlanDetails",
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
      { $unwind: "$calendar" },

      {
        $project: {
          _id: 1,
          //   _id: "$_id",
          usersDetails: {
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
          },
          product: {
            _id: "$product.productDetails._id",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
          },
          totalPrice: 1,
          planDuration: "$subscriptionPlanDetails.planDuration",
          // "totalPrice": "$totalPrice",
          vatAmount: 1,
          totalTaxablePrice: 1,
          paymentStatus: 1,
          calendar: {
            _id: "$product.productDetails._id",
            day: "$calendar.day",
            deliveryStatus: "$calendar.deliveryStatus",
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
          },
          startDate: 1,
          endDate: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          userDetails: { $first: "$usersDetails" },
          dailyChart: { $push: "$calendar" },
          product: {
            $first: "$product",
          },
          subscriptionDuration: { $first: "$planDuration" },
          totalPrice: { $first: "$totalPrice" },
          vatAmount: { $first: "$vatAmount" },
          totalTaxablePrice: { $first: "$totalTaxablePrice" },
          paymentStatus: { $first: "$paymentStatus" },
          startDate: { $first: "$startDate" },
          endDate: { $first: "$endDate" },
        },
      },
      { $unset: "userId" },
      { $unset: "subDurationId" },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (find_subscription.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionListAdmin,
      data: find_subscription,
    });
  },
  
  subscriptionListFront: async (req, res, next) => {
    const find_subscription = await UserSubscriptionModel.aggregate([
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
        $lookup: {
          from: "subscriptionplan",
          localField: "subDurationId",
          foreignField: "_id",
          as: "subscriptionPlanDetails",
        },
      },
      {
        $unwind: "$subscriptionPlanDetails",
      },
      {
        $unwind: "$product",
      },
      {
        $unwind: {
          path: "$calendar",
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
      { $unwind: "$product.productDetails" },
      // {
      //   $unwind: {
      //     path: "$product.productDetails",
      //     includeArrayIndex: "string",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $lookup: {
          from: "product",
          localField: "calendar.productId",
          foreignField: "_id",
          as: "calendar.calendarProductDetails",
        },
      },
      {
        $unwind: {
          path: "$calendar.calendarProductDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          //   _id: "$_id",
          usersDetails: {
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
          },
          product: {
            _id: "$product.productDetails._id",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
          },
          totalPrice: 1,
          planDuration: "$subscriptionPlanDetails.planDuration",
          // "totalPrice": "$totalPrice",
          leftDuration: 1,
          dailyInterval: 1,
          vatAmount: 1,
          totalTaxablePrice: 1,
          paymentStatus: 1,
          calendar: {
           _id: "$calendar._id",
            day: "$calendar.day",
            dates: "$calendar.dates",
            deliveryStatus: "$calendar.deliveryStatus",
            productName: "$calendar.calendarProductDetails.productName",
            productImage: "$calendar.calendarProductDetails.productImage",
          },
          startDate: 1,
          endDate: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          userDetails: { $first: "$usersDetails" },
          product: {
            $first: "$product",
          },
          dailyChart: { $push: "$calendar" },
          subscriptionDuration: { $first: "$planDuration" },
          totalPrice: { $first: "$totalPrice" },
          leftDuration: { $first: "$leftDuration" },
          dailyInterval: { $first: "$dailyInterval" },
          vatAmount: { $first: "$vatAmount" },
          totalTaxablePrice: { $first: "$totalTaxablePrice" },
          paymentStatus: { $first: "$paymentStatus" },
          startDate: { $first: "$startDate" },
          endDate: { $first: "$endDate" },
        },
      },
      { $unset: "userId" },
      { $unset: "subDurationId" },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (find_subscription.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionListFront,
      data: find_subscription,
    });
  },
};
