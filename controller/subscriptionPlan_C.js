var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");

module.exports = {
  addsubscriptionPlan: async (req, res, next) => {
    var find_subplan = await subscriptionPlanModel.findOne({
      planDuration: req.body.planDuration,
    });
    if (find_subplan) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_subplan = await subscriptionPlanModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionPlanadded,
      data: create_subplan,
    });
  },

  updatesubscriptionPlan: async (req, res, next) => {

    let find_subplan = await subscriptionPlanModel.findById(req.params.id);
    if (!find_subplan) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (req.body.planDuration != undefined) {
    let validDurations = [15, 30, 60, 90];
    if (!validDurations.includes(req.body.planDuration)) {
      const err = new customError(
        "Invalid plan duration. Allowed values are: 15,30,60,90",
        global.CONFIGS.responseCode.invalidInput
      );
      return next(err);
    }
    }
    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["Active", "Inactive"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError(
          "invalid activeStatus Allowed values are: Active,Inactive",
          global.CONFIGS.responseCode.invalidInput
        );
        return next(err);
      }
    }
    let existingPlan = await subscriptionPlanModel.findOne({
      planDuration: req.body.planDuration,
      _id: { $nin: [req.params.id] },
    });
    if (existingPlan) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    let updatePlan = {};
    updatePlan.planDuration = req.body.planDuration;
    updatePlan.activeStatus = req.body.activeStatus;
    find_subplan = await subscriptionPlanModel.findByIdAndUpdate(
      { _id: req.params.id },
      updatePlan,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionPlanUpdated,
      data:find_subplan,
    });
  },

  subscriptionPlanList: async (req, res, next) => {
    var find_subplan = await subscriptionPlanModel.find({});
    if (find_subplan.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalLengthOfSubPlan = find_subplan.length;

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionPlanList,
      totalLengthOfSubPlan,
      data: find_subplan,
    });
  },

  singleSubscriptionPlanByIdAdmin: async (req, res, next) => {
    var find_subplan = await subscriptionPlanModel.findById(req.params.id);
    if (!find_subplan) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.singleSubscriptionPlanAdmin,
      data: find_subplan,
    });
  },

  subscriptionPlanListFront: async (req, res, next) => {
    var find_subplan = await subscriptionPlanModel.find({
      activeStatus: "Active",
    });
    if (find_subplan.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalLengthOfSubPlan = find_subplan.length;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionPlanList,
      totalLengthOfSubPlan,
      data: find_subplan,
    });
  },

  subscriptionPlanDelete: async (req, res, next) => {
    const existingPlan = await subscriptionPlanModel.findById(req.params.id);
    if (!existingPlan) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var find_subplan = await subscriptionPlanModel.deleteOne({
      _id: req.params.id,
    });
    if (find_subplan.length == 0) {
      const err = new customError(
        global.CONFIGS.api.subscriptionPlanInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.subscriptionPlanDelete,
    });
  },
};
