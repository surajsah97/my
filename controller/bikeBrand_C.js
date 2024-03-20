var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeBrandModel = mongoose.model(constants.BikeBrandModel);
var customError = require('../middleware/customerror');

module.exports = {
    addBrand: async (req, res, next) => {
        var find_brand = await BikeBrandModel.findOne({ bikeBrand: req.body.bikeBrand });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_brand = await BikeBrandModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_brand
        })
    },

    updateBrand: async (req, res, next) => {
        let validactiveStatus = ["0","1"];
        var find_brand = await BikeBrandModel.findOne({ bikeBrand: req.body.bikeBrand, _id: { $nin: [req.params.id] } });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }

        let existing_brand = await BikeBrandModel.findById(req.params.id);
        if (!existing_brand) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }

        if (!req.body.hasOwnProperty('activeStatus')) {
            req.body.activeStatus = existing_brand.activeStatus;
        }

        if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
            return next(err);
        }

         existing_brand = await BikeBrandModel.findByIdAndUpdate(req.params.id , req.body,{new:true});
        
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandUpdated,
            data:existing_brand
        })
    },

    brandListAdmin: async (req, res, next) => {
        var find_brand = await BikeBrandModel.find({}).sort({ bikeBrand: 1});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_brand
        })
    },

    brandListFront: async (req, res, next) => {
        var find_brand = await BikeBrandModel.find({ activeStatus: "1" }).sort({ bikeBrand: 1 });
        if(find_brand.length==0){
            const err = new customError(
            global.CONFIGS.api.brandInactive,
            global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_brand
        })
    },

    brandDelete: async (req, res, next) => {
        var delete_brand = await BikeBrandModel.findByIdAndDelete({ _id: req.params.id });
        if(!delete_brand){
            const err = new customError(
          global.CONFIGS.api.brandInactive,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandDelete,
        })
    },
}