var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeBrandModel = mongoose.model(constants.BikeBrandModel);
const BikeModelModel = mongoose.model(constants.BikeModelModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {

    addmodel: async (req, res, next) => {
        var find_brand = await BikeBrandModel.findOne({ _id: req.body.bikeBrandId, activeStatus: "1" });
        if (!find_brand) {
            const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        var find_model = await BikeModelModel.findOne({ bikeModel: req.body.bikeModel });
        if (find_model) {
            const err = new customError(global.CONFIGS.api.modelalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_model = await BikeModelModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modeladded,
            data: create_model
        })
    },

    updateModel: async (req, res, next) => {
        var find_model = await BikeModelModel.findOne({ bikeModel: req.body.bikeModel, _id: { $nin: [req.params.id] } });
        if (find_model) {
            const err = new customError(global.CONFIGS.api.modelalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        };


        let existing_model = await BikeModelModel.findById(req.params.id);
        if (!existing_model) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }

        if (!req.body.hasOwnProperty('activeStatus')) {
            req.body.activeStatus = existing_model.activeStatus;
        }

        if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
            return next(err);
        }

        existing_model = await BikeModelModel.findByIdAndUpdate( req.params.id , req.body,{new:true});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modelUpdated,
            data:existing_model
        })
    },

    modelListAdmin: async (req, res, next) => {
        var find_model = await BikeModelModel.find({}).sort({ bikeModel: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getModelSuccess,
            data: find_model
        })
    },

    modelListFront: async (req, res, next) => {
        var find_model = await BikeModelModel.find({ activeStatus: "1" }).sort({ bikeModel: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getModelSuccess,
            data: find_model
        })
    },

    modelDelete: async (req, res, next) => {
        var delete_model = await BikeModelModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modelDelete,
        })
    },

}