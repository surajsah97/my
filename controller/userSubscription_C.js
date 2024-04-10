var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserSubscriptionModel = mongoose.model(constants.UserSubscriptionModel);
const common = require("../service/commonFunction");
const ObjectId = mongoose.Types.ObjectId;
// const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
// const ProductModel = mongoose.model(constants.ProductModel);
var customError = require("../middleware/customerror");
const UserModel = mongoose.model(constants.UserModel);
const UserAddressModel = mongoose.model(constants.UserAddressModel);
const SubscriptionCheckOutModel = mongoose.model(
  constants.SubscriptionCheckOutModel
);

module.exports = {
 addSub: async (req, res, next) => {
    try {
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
      const userDetail = await UserModel.findOne({ _id: subscriptioncheckOutdata.userId });
      if (!userDetail) {
        const err = new customError(
          global.CONFIGS.api.userNotFound,
          global.CONFIGS.responseCode.notFound
        );  
        return next(err);
      }
      const userAddress = await UserAddressModel.findOne(
        { userId: subscriptioncheckOutdata.userId },
        { _id: -1 }
        ).sort({ _id: -1 });

      if (!userAddress) {
        const err = new customError(
          global.CONFIGS.api.deliveryAddressNotFound,
          global.CONFIGS.responseCode.notFound
        );  
        return next(err);
      }

      var find_subscription = await UserSubscriptionModel.findOne({
        userId: subscriptioncheckOutdata.userId,
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
      
      addSubscription.vatAmount = Math.round(
        subscriptioncheckOutdata.vatAmount
      );
      addSubscription.totalPrice = Math.round(
        subscriptioncheckOutdata.totalPrice
      );
      addSubscription.product = subscriptioncheckOutdata.product;
      addSubscription.addressId = userAddress._id;
      addSubscription.startDate = subscriptioncheckOutdata.startDate;
      addSubscription.endDate = subscriptioncheckOutdata.endDate;
      addSubscription.leftDuration = subscriptioncheckOutdata.leftDuration;
      addSubscription.dailyInterval = subscriptioncheckOutdata.dailyInterval;
      addSubscription.calendar = subscriptioncheckOutdata.calendar;
      addSubscription.subDurationId = subscriptioncheckOutdata.subDurationId;
      addSubscription.totalTaxablePrice = Math.round(
        subscriptioncheckOutdata.totalTaxablePrice
      );
      addSubscription.userId = subscriptioncheckOutdata.userId;
      addSubscription.transactionId = req.body.transactionId;
      addSubscription.paymentStatus = req.body.paymentStatus;
      const subscription = await UserSubscriptionModel.create(addSubscription);

      if (subscription) {
        var update_checkout = await SubscriptionCheckOutModel.findOneAndUpdate(
          { _id: req.body.subscriptionCheckoutId },
          { activeStatus: "Expired" }
        ).sort({ _id: -1 });
        var update_user = await UserModel.findOneAndUpdate(
          { _id: subscriptioncheckOutdata.userId },
          { userType: "User" }
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
     const limit = parseInt(req.query.limit) || 10; 
     const pageNo = parseInt(req.query.pageNo) || 1; 
     const skip = (pageNo - 1) * limit;
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
            productUOM: "$product.productDetails.productUOM",
            tagLine: "$product.productDetails.tagLine",
          },
          totalPrice: 1,
          planDuration: "$subscriptionPlanDetails.planDuration",
          // "totalPrice": "$totalPrice",
          leftDuration: 1,
          vatAmount: 1,
          totalTaxablePrice: 1,
          paymentStatus: 1,
          calendar: {
            _id: "$product.productDetails._id",
            day: "$calendar.day",
          dates: {
            $dateToString: { format: "%Y-%m-%d", date: "$calendar.dates" }
          },
            deliveryStatus: "$calendar.deliveryStatus",
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
            productUOM: "$product.productDetails.productUOM",
            tagLine: "$product.productDetails.tagLine",
          },
          // startDate: 1,
          // endDate: 1,
          startDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
          },
          endDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$endDate" }
          },
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
          leftDuration: { $first: "$leftDuration" },
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
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
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


    const total = parseInt(find_subscription[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(find_subscription[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionListAdmin,
      totalSubscription: total,
      totalPage: totalPage,
      data: find_subscription[0].data,
    });
  },
  
  subscriptionListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10; 
    const pageNo = parseInt(req.query.pageNo) || 1; 
    const skip = (pageNo - 1) * limit;
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
            userId: "$usersDetails._id",
            name: "$usersDetails.name",
            email: "$usersDetails.email",
            mobile: "$usersDetails.mobile",
            userType: "$usersDetails.userType",
          },
          product: {
            _id: "$product.productDetails._id",
            qty: "$product.qty",
            productPrice: "$product.productDetails.productPrice",
            productName: "$product.productDetails.productName",
            productImage: "$product.productDetails.productImage",
            productUOM: "$product.productDetails.productUOM",
            tagLine: "$product.productDetails.tagLine",
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
            // dates: "$calendar.dates",
          dates: {
            $dateToString: { format: "%Y-%m-%d", date: "$calendar.dates" }
          },
            deliveryStatus: "$calendar.deliveryStatus",
            productName: "$calendar.calendarProductDetails.productName",
            productImage: "$calendar.calendarProductDetails.productImage",
            productUOM: "$calendar.calendarProductDetails.productUOM",
            tagLine: "$calendar.calendarProductDetails.tagLine",
          },
          // startDate: 1,
          // endDate: 1,
          startDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
          },
          endDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$endDate" }
          },
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
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
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
    const total = parseInt(find_subscription[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(find_subscription[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      totalSubscription: total,
      totalPage: totalPage,
      message: global.CONFIGS.api.subscriptionListFront,
      data: find_subscription[0].data,
    });
  },

  singleSubscriptionByIdFront: async (req, res, next) => {
    const find_subscription = await UserSubscriptionModel.aggregate([
      {
        $match: {
          activeStatus: "Active",
          userId: new ObjectId(req.query.userId),
          _id:new ObjectId(req.query.subscriptionId)
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
            productUOM: "$product.productDetails.productUOM",
            tagLine: "$product.productDetails.tagLine",
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
            // dates: "$calendar.dates",
          dates: {
            $dateToString: { format: "%Y-%m-%d", date: "$calendar.dates" }
          },
            deliveryStatus: "$calendar.deliveryStatus",
            productName: "$calendar.calendarProductDetails.productName",
            productImage: "$calendar.calendarProductDetails.productImage",
            productUOM: "$calendar.calendarProductDetails.productUOM",
            tagLine: "$calendar.calendarProductDetails.tagLine",
          },
          // startDate: 1,
          // endDate: 1,
          startDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
          },
          endDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$endDate" }
          },
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
      {
        $facet: {
        data: [], 
        },
      },
    ]);
    if (find_subscription[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionListFront,
      data: find_subscription[0].data,
    });
  },


 updateSubscriptionByUser: async (req, res, next) => {
        let find_subscription = await UserSubscriptionModel.findById(req.params.id);
        console.log(find_subscription,"....find_subscription")
        if (!find_subscription) {
        const err = new customError(global.CONFIGS.api.subscriptionNotfound, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
        
        if(req.body.activeStatus!=undefined){
            let validactiveStatus = ["Active", "Inactive", "Expired"];
            if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: Active, Inactive, Expired", global.CONFIGS.responseCode.invalidInput);
            return next(err);
            }
            if(validactiveStatus==="Inactive"){
              var update_subscription = await UserSubscriptionModel.findByIdAndUpdate( req.params.id, 
              {
                activeStatus:req.body.activeStatus,
                "pauseresumeDate.pauseDate":next_date,
              },{new:true});
            }
            if(validactiveStatus==="Active"){
              for(var i=0; i>find_subscription.pauseresumeDate.length; i++){
                if(find_subscription.pauseresumeDate[i].pauseDate!= undefined && find_subscription.pauseresumeDate[i].resumeDate== undefined){
                  var updateSub = await UserSubscriptionModel.updateOne({ _id: req.params._id }, { activeStatus: req.body.activeStatus, "pauseresumeDate.$[xxx].resumeDate": date },
                  {
                            arrayFilters: [
                                { "xxx._id": find_subscription.pauseresumeDate[i]._id }
                            ]
                        });
                }
              }
              var update_subscription = await UserSubscriptionModel.findByIdAndUpdate( req.params.id, 
              {
                activeStatus:req.body.activeStatus,
                "pauseresumeDate.pauseDate":next_date,
              },{new:true});
            }
        }

        find_subscription = await UserSubscriptionModel.findByIdAndUpdate( req.params.id , req.body,{new:true});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modelUpdated,
            data:find_subscription
        })
    },


};