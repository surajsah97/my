var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckBrandModel = mongoose.model(constants.TruckBrandModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {
    addBrand: async (req, res, next) => {
        var find_brand = await TruckBrandModel.findOne({ truckBrand: req.body.truckBrand });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.categoryalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var create_brand = await TruckBrandModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryadded,
            data: create_brand
        })
    },

    updateBrand: async (req, res, next) => {
        var find_brand = await TruckBrandModel.findOne({ truckBrand: req.body.truckBrand, _id: { $nin: [req.params.id] } });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.categoryalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var update_brand = await TruckBrandModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryUpdated,
        })
    },

    brandList: async (req, res, next) => {
        var find_brand = await TruckBrandModel.find({}).sort({ truckBrand : 1});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryUpdated,
            data: find_brand
        })
    },

    brandListFront: async (req, res, next) => {
        var find_brand = await TruckBrandModel.find({ activeStatus: "1" }).sort({ truckBrand: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryUpdated,
            data: find_brand
        })
    },

    brandDelete: async (req, res, next) => {
        var delete_brand = await TruckBrandModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryDelete,
        })
    },
}