var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeBrandModel = mongoose.model(constants.BikeBrandModel);
var customError = require('../middleware/customerror');

module.exports = {
    addBrand: async (req, res, next) => {
        var find_brand = await BikeBrandModel.findOne({ bikeBrand: req.body.bikeBrand });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var create_brand = await BikeBrandModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_brand
        })
    },

    updateBrand: async (req, res, next) => {
        var find_brand = await BikeBrandModel.findOne({ bikeBrand: req.body.bikeBrand, _id: { $nin: [req.params.id] } });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var update_brand = await BikeBrandModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandUpdated,
        })
    },

    brandList: async (req, res, next) => {
        var find_brand = await BikeBrandModel.find({}).sort({ bikeBrand: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_brand
        })
    },

    brandListFront: async (req, res, next) => {
        var find_brand = await BikeBrandModel.find({ activeStatus: "1" }).sort({ bikeBrand: 1 });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_brand
        })
    },

    brandDelete: async (req, res, next) => {
        var delete_brand = await BikeBrandModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandDelete,
        })
    },
}