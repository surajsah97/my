var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const SubscriptionCheckOutModel = mongoose.model(constants.SubscriptionCheckOutModel);
const UserModel = mongoose.model(constants.UserModel);
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const ObjectId = mongoose.Types.ObjectId;
const ProductModel = mongoose.model(constants.ProductModel);
var customError = require("../middleware/customerror");
const UserSubscriptionModel = mongoose.model(constants.UserSubscriptionModel);

module.exports = {
  // checkoutSubscription111: async (req, res) => {
  //   let { userId } = req.body;
  //   let userDetail = await UserModel.findOne({ _id: userId });
  //   console.log(userDetail, "....qqqqqq");

  //   if (!userDetail) {
  //     const err = new customError(
  //       global.CONFIGS.api.userNotFound,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }

  //   let find_subscription = await UserSubscriptionModel.findOne({ userId: req.body.userId });
  //   console.log(find_subscription, ",......find_subscription");
  //   if (!find_subscription) {
  //     const err = new customError(
  //       global.CONFIGS.api.subscriptionNotfound,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }
  //   const product = find_subscription.product;
  //   if (!product) {
  //     const err = new customError(
  //       global.CONFIGS.api.ProductNotfound,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }

  //   let checkoutSubscription = {};
  //   checkoutSubscription.paymentStatus = find_subscription.paymentStatus;
  //   checkoutSubscription.subDurationId = find_subscription.subDurationId;
  //   checkoutSubscription.vatAmount = Math.round(find_subscription.vatAmount);
  //   checkoutSubscription.totalPrice = Math.round(find_subscription.totalPrice);
  //   checkoutSubscription.product = product;
  //   checkoutSubscription.totalTaxablePrice = Math.round(
  //     find_subscription.totalTaxablePrice
  //   );
  //   checkoutSubscription.userId = userId;
  //   const create_SubCheckout = await SubscriptionCheckOutModel.create(checkoutSubscription);
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
   checkoutSubscription: async (req, res,next) => {
    try {
      const { userId } = req.body;
      const userDetail=await UserModel.findOne({_id:userId})
      if (!userDetail) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

 
    var find_subscription = await UserSubscriptionModel.find({
        userId: userId,
      }).sort({ _id: -1 });
      console.log(find_subscription, ".....find_subscription");
      if (find_subscription) {
        var prodinsubscription = find_subscription.some((item) => item.product[0].productId == req.body.product[0].productId);
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
        .findById({ _id: new ObjectId(req.body.subDurationId) })
        .select("planDuration");
      console.log(subDuration, "............subduration");
      if (!subDuration) {
        return res.status(404).json({
          success: false,
          message: "Subscription duration not found.",
        });
      }
      const productDetails = await ProductModel.find({
        _id: { $in: req.body.product[0].productId },
      });
      console.log(productDetails);
      let productPrice = {};
      productDetails.map((el) => {
        productPrice = el.productPrice;
      });
      console.log(productPrice, "...productPrice...");

      const totalSubPrice =
        productPrice * req.body.product[0].qty * subDuration.planDuration;
      console.log(totalSubPrice, "....totalSubPrice");
      let addSubscriptionCheckout = {};
      const vat = 5;
      const taxAmount = totalSubPrice * (vat / 100);
      const totalTaxablePrice = totalSubPrice + taxAmount;
      addSubscriptionCheckout.vatAmount = Math.round(taxAmount);
      addSubscriptionCheckout.totalPrice = Math.round(totalSubPrice);
      addSubscriptionCheckout.product = req.body.product;
      addSubscriptionCheckout.subDurationId = req.body.subDurationId;
      addSubscriptionCheckout.totalTaxablePrice = Math.round(totalTaxablePrice);
      addSubscriptionCheckout.userId = userId;
      const create_SubCheckout = await SubscriptionCheckOutModel.create(addSubscriptionCheckout);
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
    }catch (error) {
      console.log(error);
      res.status(global.CONFIGS.responseCode.exception).json({
        success: false,
        message: error.message,
      });
    }
  },
};
