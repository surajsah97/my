var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const SubscriptionCheckOutModel = mongoose.model(constants.SubscriptionCheckOutModel);
const UserModel = mongoose.model(constants.UserModel);
const UserSubscriptionModel = mongoose.model(constants.UserSubscriptionModel);

module.exports = {
  checkoutSubscription: async (req, res) => {
    let { userId } = req.body;
    let userDetail = await UserModel.findOne({ _id: userId });
    console.log(userDetail, "....qqqqqq");

    if (!userDetail) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    let find_subscription = await UserSubscriptionModel.findOne({ userId: req.body.userId });
    console.log(find_subscription, ",......find_subscription");
    if (!find_subscription) {
      const err = new customError(
        global.CONFIGS.api.subscriptionNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const product = find_subscription.product;
    if (!product) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    let checkoutSubscription = {};
    checkoutSubscription.paymentStatus = find_subscription.paymentStatus;
    checkoutSubscription.subDurationId = find_subscription.subDurationId;
    checkoutSubscription.vatAmount = Math.round(find_subscription.vatAmount);
    checkoutSubscription.totalPrice = Math.round(find_subscription.totalPrice);
    checkoutSubscription.product = product;
    checkoutSubscription.totalTaxablePrice = Math.round(
      find_subscription.totalTaxablePrice
    );
    checkoutSubscription.userId = userId;
    const create_SubCheckout = await SubscriptionCheckOutModel.create(checkoutSubscription);
    if (create_SubCheckout) {
      let userdata = {
        name: userDetail.name,
        email: userDetail.email,
        mobile: userDetail.mobile,
        isVerified: userDetail.isVerified,
        userType: userDetail.userType,
        activeStatus: userDetail.activeStatus,
        trialActive: userDetail.trialActive,
        trialQuantity: userDetail.trialQuantity,
      };

      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.SubscriptionCheckOutadded,
        data: create_SubCheckout,
        userdata: userdata,
      });
    }
  },
};
