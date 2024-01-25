var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {
    addsubscriptionPlan: async (req, res, next) => {
        var find_subplan = await subscriptionPlanModel.findOne({ planDuration: req.body.planDuration });
        if (find_subplan) {
            const err = new customError(global.CONFIGS.api.subscriptionPlanalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_subplan = await subscriptionPlanModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanadded,
            data: create_subplan
        })
    },

    updatesubscriptionPlan: async (req, res, next) => {
        var find_subplan = await subscriptionPlanModel.findOne({ planDuration: req.body.planDuration, _id: { $nin: [req.params.id] } });
        if (find_subplan) {
            const err = new customError(global.CONFIGS.api.subscriptionPlanalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_subplan = await subscriptionPlanModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanUpdated,
        })
    },

    subscriptionPlanList: async (req, res, next) => {
        var find_subplan = await subscriptionPlanModel.find({});
        if (find_subplan.length == 0) {
            const err = new customError(global.CONFIGS.api.subscriptionPlanInactive, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanList,
            data: find_subplan
        })
    },

    subscriptionPlanListFront: async (req, res, next) => {
        var find_subplan = await subscriptionPlanModel.find({ activeStatus: "Active" });
        if (find_subplan.length == 0) {
            const err = new customError(global.CONFIGS.api.subscriptionPlanInactive, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanList,
            data: find_subplan
        })
    },

    subscriptionPlanDelete: async (req, res, next) => {
        var find_subplan = await subscriptionPlanModel.deleteOne({ _id: req.params.id });
        if (find_subplan.length == 0) {
            const err = new customError(global.CONFIGS.api.subscriptionPlanInactive, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.subscriptionPlanDelete,
        })
    },

}