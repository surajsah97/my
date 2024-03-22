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
}