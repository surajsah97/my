var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckBrandModel = mongoose.model(constants.TruckBrandModel);
const TruckModelModel = mongoose.model(constants.TruckModelModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {

    addmodel: async (req, res, next) => {
        var find_brand = await TruckBrandModel.findOne({ _id: req.body.truckBrandId, activeStatus: "1" });
        if (!find_brand) {
            const err = new customError(global.CONFIGS.api.categoryInactive, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var find_model = await TruckModelModel.findOne({ truckModel: req.body.truckModel });
        if (find_model) {
            const err = new customError(global.CONFIGS.api.Subcategoryalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var create_model = await TruckModelModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Subcategoryadded,
            data: create_model
        })
    },

    updateModel: async (req, res, next) => {
        var find_model = await TruckModelModel.findOne({ truckModel: req.body.truckModel, _id: { $nin: [req.body.id] } });
        if (find_model) {
            const err = new customError(global.CONFIGS.api.Subcategoryalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var update_model = await TruckModelModel.updateOne({ _id: req.body.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.SubcategoryUpdated,
        })
    },

    modelList: async (req, res, next) => {
        var find_model = await TruckModelModel.find({}).sort({ truckModel : 1});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.SubcategoryUpdated,
            data: find_model
        })
    },

    modelListFront: async (req, res, next) => {
        var find_model = await TruckModelModel.find({ activeStatus: "1" }).sort({ truckModel: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.SubcategoryUpdated,
            data: find_model
        })
    },

    modelDelete: async (req, res, next) => {
        var delete_model = await TruckModelModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.SubcategoryDelete,
        })
    },

}