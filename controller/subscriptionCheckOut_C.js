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
    const startDate = new Date();
    startDate.setDate(startDate.getDate()); // Today
    let endDate = new Date(startDate.getTime());
let differenceInDays;
    if (dailyInterval === "daily") {
    endDate.setDate(endDate.getDate() + (subDuration.planDuration - 1)); // 15 days includes today

    console.log(startDate, "...currentDate...");
    console.log(endDate, "....eeeeeee");

    const differenceInMilliseconds = endDate - startDate;
     differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
      for (let i = 0; i <= differenceInDays; i++) {
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
    endDate.setDate(endDate.getDate() + (subDuration.planDuration*2 - 1)); // 15 days includes today

    console.log(startDate, "...currentDate...");
    console.log(endDate, "....eeeeeee");

    const differenceInMilliseconds = endDate - startDate;
     differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    // console.log(differenceInDays,"...diffinday");
      for (let i = 0; i <= differenceInDays; i++) {
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
      leftDuration: differenceInDays,
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

  /**long code */
  // checkoutSubscription: async (req, res, next) => {
  //   const { userId } = req.body;
  //   console.log(userId, ".......lkl");
  //   let dailyInterval = req.body.dailyInterval;
  //   console.log(dailyInterval);
  //   const userDetail = await UserModel.findOne({ _id: userId });
  //   console.log(userDetail, ".........222222222userDetail");
  //   if (!userDetail) {
  //     const err = new customError(
  //       global.CONFIGS.api.userNotFound,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }

  //   var find_subscription = await UserSubscriptionModel.find({
  //     userId: userId,
  //   }).sort({ _id: -1 });
  //   console.log(find_subscription, ".....find_subscription");
  //   if (find_subscription) {
  //     var prodinsubscription = find_subscription.some(
  //       (item) => item.product[0].productId == req.body.product[0].productId
  //     );
  //     console.log(prodinsubscription);
  //     if (prodinsubscription === true) {
  //       const err = new customError(
  //         global.CONFIGS.api.subscriptionalreadyadded,
  //         global.CONFIGS.responseCode.alreadyExist
  //       );
  //       return next(err);
  //     }
  //   }

  //   const subDuration = await subscriptionPlanModel
  //     .findById({ _id: new ObjectId(req.body.subDurationId) })
  //     .select("planDuration");
  //   console.log(subDuration, "............subduration");
  //   if (!subDuration) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Subscription duration not found.",
  //     });
  //   }
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() + 1); // Tomorrow
  //   let endDate = new Date(startDate.getTime());
  //   endDate.setDate(endDate.getDate() + subDuration.planDuration); // 15 days after tomorrow
  //   console.log(startDate, "...currentDate...");
  //   console.log(endDate, "....eeeeeee");

  //   const differenceInMilliseconds = endDate - startDate;
  //   const differenceInDays = Math.floor(
  //     differenceInMilliseconds / (1000 * 60 * 60 * 24)
  //   );
  //   const calendarItem = [];
  //   if (dailyInterval == "daily") {
  //     for (let i = 1; i <= differenceInDays; i++) {
  //       let obj = {};
  //       obj.productId = req.body.product[0].productId;
  //       obj.day = i;
  //       calendarItem.push(obj);
  //     }
  //   } else if (dailyInterval == "alternate") {
  //     for (let i = 1; i <= differenceInDays * 2; i++) {
  //       let obj = {};
  //       obj.productId = req.body.product[0].productId;
  //       obj.day = i;
  //       calendarItem.push(obj);
  //     }

  //     const alternateDaysEven = calendarItem.filter(
  //       (item) => item.day % 2 === 0
  //     );
  //     console.log(alternateDaysEven, ".........alternateDaysEven");
  //     const alternateDaysOdd = calendarItem.filter(
  //       (item) => item.day % 2 !== 0
  //     );
  //     console.log(alternateDaysOdd, ".........alternateDaysOdd");
  //   }
  //   console.log(calendarItem, "....calendarItem");

  //   const productDetails = await ProductModel.find({
  //     _id: { $in: req.body.product[0].productId },
  //   });
  //   // console.log(productDetails,".........productDetails");
  //   let productPrice = {};
  //   productDetails.map((el) => {
  //     productPrice = el.productPrice;
  //   });
  //   console.log(productPrice, "...productPrice...");

  //   const totalSubPrice =
  //     productPrice * req.body.product[0].qty * subDuration.planDuration;
  //   console.log(totalSubPrice, "....totalSubPrice");
  //   const vat = 5;
  //   const taxAmount = totalSubPrice * (vat / 100);
  //   const totalTaxablePrice = totalSubPrice + taxAmount;
  //   let addSubscriptionCheckout = {};
  //   addSubscriptionCheckout.vatAmount = Math.round(taxAmount);
  //   addSubscriptionCheckout.totalPrice = Math.round(totalSubPrice);
  //   addSubscriptionCheckout.product = req.body.product;
  //   addSubscriptionCheckout.dailyInterval = req.body.dailyInterval;
  //   addSubscriptionCheckout.startDate = startDate;
  //   addSubscriptionCheckout.endDate = endDate;
  //   addSubscriptionCheckout.leftDuration = differenceInDays;
  //   addSubscriptionCheckout.calendar = calendarItem;
  //   addSubscriptionCheckout.subDurationId = req.body.subDurationId;
  //   addSubscriptionCheckout.totalTaxablePrice = Math.round(totalTaxablePrice);
  //   addSubscriptionCheckout.userId = userId;
  //   const create_SubCheckout = await SubscriptionCheckOutModel.create(
  //     addSubscriptionCheckout
  //   );
  //   if (create_SubCheckout) {
  //     let userdata = {
  //       name: userDetail.name,
  //       email: userDetail.email,
  //       mobile: userDetail.mobile,
  //       isVerified: userDetail.isVerified,
  //       userType: userDetail.userType,
  //       activeStatus: userDetail.activeStatus,
  //     };
  //     return res.status(global.CONFIGS.responseCode.success).json({
  //       success: true,
  //       message: global.CONFIGS.api.SubscriptionCheckOutadded,
  //       data: create_SubCheckout,
  //       userdata: userdata,
  //     });
  //   }
  // },
  /** */
};
