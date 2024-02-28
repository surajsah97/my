var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);
var customError = require('../middleware/customerror');

module.exports = {
    addlocation: async (req, res, next) => {
        var find_location = await DeliveryLocationModel.findOne({ location: req.body.location });
        if (find_location) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_location = await DeliveryLocationModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_location
        })
    },

    updatelocation: async (req, res, next) => {
        var find_location = await DeliveryLocationModel.findOne({ location: req.body.location, _id: { $nin: [req.params.id] } });
        if (find_location) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var update_location = await DeliveryLocationModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandUpdated,
        })
    },

    locationList: async (req, res, next) => {
        var find_location = await DeliveryLocationModel.find({}).sort({ location: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_location
        })
    },

    locationListFront: async (req, res, next) => {
        var find_location = await DeliveryLocationModel.find({ activeStatus: "Active" }).sort({ location: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_location
        })
    },

    locationDelete: async (req, res, next) => {
        var delete_location = await DeliveryLocationModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandDelete,
        })
    },
}