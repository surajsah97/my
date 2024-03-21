var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const SubscriptionCheckOutModel = mongoose.model(
  constants.SubscriptionCheckOutModel
);
const UserModel = mongoose.model(constants.UserModel);
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const ObjectId = mongoose.Types.ObjectId;
const ProductModel = mongoose.model(constants.ProductModel);
var customError = require("../middleware/customerror");
const UserSubscriptionModel = mongoose.model(constants.UserSubscriptionModel);

module.exports = {
  /**short code */
  checkoutSubscription: async (req, res, next) => {
    const { userId, dailyInterval, product, subDurationId } = req.body;
    console.log(userId, ".......userId");
    console.log(dailyInterval);
    const userDetail = await UserModel.findOne({ _id: userId });
    console.log(userDetail, ".........222222222userDetail");
    if (!userDetail) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const find_subscription = await UserSubscriptionModel.find({ userId }).sort(
      { _id: -1 }
    );
    console.log(find_subscription, ".....find_subscription");
    if (find_subscription) {
      const prodinsubscription = find_subscription.some(
        (item) => item.product[0].productId == product[0].productId
      );
      console.log(prodinsubscription);
      if (prodinsubscription === true) {
        const err = new customError(
          global.CONFIGS.api.subscriptionalreadyadded,
          global.CONFIGS.responseCode.alreadyExist
        );
        return next(err);
      }
    }

    const subDuration = await subscriptionPlanModel
      .findById({ _id: new ObjectId(subDurationId) })
      .select("planDuration");
    console.log(subDuration, "............subduration");
    if (!subDuration) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const calendarItem = [];
    const startDate = new Date(req.body.startDate);
    startDate.setDate(startDate.getDate()); // Today
    let endDate = new Date(startDate.getTime());
    let differenceInDays;
    if (dailyInterval === "daily") {
    endDate.setDate(endDate.getDate() + (subDuration.planDuration -1)); // 15 days includes today

    console.log(startDate, "...currentDate...");
    console.log(endDate, "....eeeeeee");

    differenceInDays = subDuration.planDuration

      for (let i = 0; i < differenceInDays; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        let obj = {};
        obj.productId = product[0].productId;
        obj.day = i + 1;
        obj.dates = currentDate.toISOString().slice(0, 10);
        calendarItem.push(obj);
      }
    } else if (dailyInterval === "alternate") {
    // const startDate = new Date();
    // startDate.setDate(startDate.getDate()); // Today
    // let endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + ((subDuration.planDuration*2)-1)); // 15 days includes today

    console.log(startDate, "...currentDate...");
    console.log(endDate, "....eeeeeee");

    differenceInDays =subDuration.planDuration*2;
    // console.log(differenceInDays,"...diffinday");
      for (let i = 0; i < differenceInDays; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        let obj = {};
        obj.productId = product[0].productId;
        obj.day = i + 1;
        obj.dates = currentDate;
        calendarItem.push(obj);
      }
    }
    console.log(calendarItem, "....calendarItem");

    const productDetails = await ProductModel.find({
      _id: { $in: product[0].productId },
    });
    let productPrice = {};
    productDetails.map((el) => {
      productPrice = el.productPrice;
    });
    console.log(productPrice, "...productPrice...");

    const totalSubPrice =
      productPrice * product[0].qty * subDuration.planDuration;
    console.log(totalSubPrice, "....totalSubPrice");

    const vat = 5;
    const taxAmount = totalSubPrice * (vat / 100);
    const totalTaxablePrice = totalSubPrice + taxAmount;

    const addSubscriptionCheckout = {
      vatAmount: Math.round(taxAmount),
      totalPrice: Math.round(totalSubPrice),
      product,
      dailyInterval,
      startDate,
      endDate,
      leftDuration: subDuration.planDuration,
      calendar: calendarItem,
      subDurationId,
      totalTaxablePrice: Math.round(totalTaxablePrice),
      userId,
    };
    const create_SubCheckout = await SubscriptionCheckOutModel.create(
      addSubscriptionCheckout
    );
    if (create_SubCheckout) {
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
        message: global.CONFIGS.api.SubscriptionCheckOutadded,
        data: create_SubCheckout,
        userdata: userdata,
      });
    }
  },

subscriptionCheckoutListFront: async (req, res, next) => {
    const find_subscription = await SubscriptionCheckOutModel.aggregate([
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
          leftDuration: 1,
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
