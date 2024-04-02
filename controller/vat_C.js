var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const VatModel = mongoose.model(constants.VatModel);
var customError = require('../middleware/customerror');

module.exports={
     addVat: async (req, res, next) => {
        var existing_vat = await VatModel.find();
        // console.log(existing_vat);
        if (existing_vat.length !== 0) {
            const update_vat = await VatModel.updateOne({ vatPercentage: req.body.vatPercentage });
             return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: update_vat
        })
        }else{
        var create_vat = await VatModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_vat
        })
        }
    },

    vatListAdmin: async (req, res, next) => {
        var find_vat = await VatModel.find();
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_vat
        })
    },

    vatListFront: async (req, res, next) => {
        var find_vat = await VatModel.find({ activeStatus: "1" }).sort({ vatPercentage: 1 });
        if(find_vat.length==0){
            const err = new customError(
            global.CONFIGS.api.brandInactive,
            global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getBrandSuccess,
            data: find_vat[0]
        })
    },

    vatDelete: async (req, res, next) => {
        const delete_vat = await VatModel.findByIdAndDelete({ _id: req.params.id });
        if(!delete_vat){
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