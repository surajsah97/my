var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckBrandModel = mongoose.model(constants.TruckBrandModel);
var customError = require('../middleware/customerror');

module.exports = {
    addBrand: async (req, res, next) => {
        const find_brand = await TruckBrandModel.findOne({ truckBrand: req.body.truckBrand });
        if (find_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        const create_brand = await TruckBrandModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_brand
        })
    },
/**completed changes successfully */
    updateBrand: async (req, res, next) => {
        let find_brand = await TruckBrandModel.findById(req.params.id);
        if (!find_brand) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
        const existing_brand = await TruckBrandModel.findOne({ truckBrand: req.body.truckBrand, _id: { $nin: [req.params.id] } });
        if (existing_brand) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }

        if(req.body.activeStatus!=undefined){
            let validactiveStatus = ["0","1"];
            if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
            return next(err);
            }
        }

         find_brand = await TruckBrandModel.findByIdAndUpdate(req.params.id , req.body,{new:true});
        
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandUpdated,
            data:find_brand
        });
    },

/**completed changes successfully */
    brandDelete: async (req, res, next) => {
        const delete_brand = await TruckBrandModel.findByIdAndDelete({ _id: req.params.id });
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
/**completed changes successfully */
    brandListAdmin: async (req, res, next) => {
        const find_brand = await TruckBrandModel.find({}).sort({ truckBrand : 1});
        const total=find_brand.length;
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            totalTruckBrand:`${total} no of quantity`,
            data: find_brand
        })
    },
/**completed changes successfully */
    brandListFront: async (req, res, next) => {
        const find_brand = await TruckBrandModel.find({ activeStatus: "1" }).sort({ truckBrand: 1 });
        const total=find_brand.length;
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            totalTruckBrand:`${total} no of quantity`,
            data: find_brand
        })
    },
}