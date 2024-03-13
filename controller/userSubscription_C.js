var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const SubModel = mongoose.model(constants.SubModel);
const common = require("../service/commonFunction");
const ObjectId = mongoose.Types.ObjectId;
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const ProductModel = mongoose.model(constants.ProductModel);
var customError = require('../middleware/customerror');

module.exports = {
  addSub: async (req, res) => {
    try {
      const { userId } = req.body;
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

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(
        startDate.getTime() + subDuration.planDuration * 24 * 60 * 60 * 1000
      );
      console.log(startDate, "...currentDate...");
      console.log(endDate, "....eeeeeee");

      const productDetails = await ProductModel.find({
        _id: { $in: req.body.product[0].productId },
      });
      console.log(productDetails);
      let productPrice = {};
      productDetails.map((el) => {
        productPrice = el.productPrice;
      });
      console.log(productPrice, "...productPrice...");
      const totalSubPrice = productPrice * req.body.product[0].qty;
      console.log(totalSubPrice, "....totalSubPrice");
      let addSubscription = {};
      const vat = 5;
      const taxAmount = totalSubPrice * (vat / 100);
      const totalTaxablePrice = totalSubPrice + taxAmount;
      addSubscription.vatAmount = Math.round(taxAmount);
      addSubscription.totalPrice = Math.round(totalSubPrice);
      addSubscription.product = req.body.product;
      addSubscription.startDate = startDate;
      addSubscription.endDate = endDate;
      addSubscription.subDurationId = req.body.subDurationId;
      addSubscription.totalTaxablePrice = Math.round(totalTaxablePrice);
      addSubscription.userId = userId;
      const subscription = await SubModel.create(addSubscription);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.subscriptionadded,
        data: subscription,
      });
    } catch (error) {
      console.log(error);
      res.status(global.CONFIGS.responseCode.exception).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateSub: async (req, res) => {
    try {
      var find_prod = await SubModel.findOne({
        productName: req.body.productName,
        _id: { $nin: [req.body.id] },
      });
      if (find_prod) {
        return res.status(global.CONFIGS.responseCode.alreadyExist).json({
          success: false,
          message: global.CONFIGS.api.categoryalreadyadded,
        });
      }
      var update_prod = await SubModel.updateOne(
        { _id: req.body.id },
        req.body
      );
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.categoryUpdated,
      });
    } catch (error) {
      console.log(error);
      res.status(global.CONFIGS.responseCode.exception).json({
        success: false,
        message: error.message,
      });
    }
  },

  deletesub: async (req, res,next) => {
    const existingSubscription = await SubModel.findById(req.params.id);
        if (!existingSubscription) {
            const err = new customError(global.CONFIGS.api.subscriptionNotfound, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
      var delete_subscription = await SubModel.deleteOne({ _id: req.params.id });
      if (delete_subscription.length == 0) {
            const err = new customError(global.CONFIGS.api.subscriptionInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.alreadyExist).json({
          success: true,
          message: global.CONFIGS.api.subscriptionDelete,
        });
  },

subscriptionListByAdmin: async (req, res, next) => {
        var find_subscription = await SubModel.find({});
        if (find_subscription.length == 0) {
            const err = new customError(global.CONFIGS.api.subscriptionInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        const totalLengthOfSubPlan = find_subscription.length;

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanList,
            totalLengthOfSubPlan,
            data: find_subscription
        })
    },

};
