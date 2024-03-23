var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const VatModel = mongoose.model(constants.VatModel);
var customError = require('../middleware/customerror');

module.exports={
     addVat: async (req, res, next) => {
        var find_vat = await VatModel.findOne({ vatPercentage: req.body.vatPercentage });
        if (find_vat) {
            const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_vat = await VatModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandadded,
            data: create_vat
        })
    },

    vatListAdmin: async (req, res, next) => {
        var find_vat = await VatModel.find({}).sort({ vatPercentage: 1});
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
            data: find_vat
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

    updateVat: async (req, res, next) => {
        let find_vat = await VatModel.findById(req.params.id);
        if (!find_vat) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
        const existing_vat = await VatModel.findOne({ vatPercentage: req.body.vatPercentage, _id: { $nin: [req.params.id] } });
        if (existing_vat) {
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

         find_vat = await VatModel.findByIdAndUpdate(req.params.id , req.body,{new:true});
        
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.brandUpdated,
            data:find_vat
        })
    },
}