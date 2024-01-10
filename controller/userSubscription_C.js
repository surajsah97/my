var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const SubModel = mongoose.model(constants.SubModel);
const common = require("../service/commonFunction");

module.exports = {
    addSub: async (req, res) => {

        var find_prod = await ProductModel.findOne({ productName: req.body.productName });
        if (find_prod) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var create_prod = await ProductModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_prod
        })
    },
    addSub: async (req, res) => {
        try {
            if (req.files) {
                req.body.productImage = `uploads/${req.files.productImage[0].originalname}`
            }
            var find_prod = await SubModel.findOne({ productName: req.body.productName });
            if (find_prod) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var create_prod = await SubModel.create(req.body);
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.categoryadded,
                data: create_prod
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    updateSub: async (req, res) => {
        try {
            var find_prod = await SubModel.findOne({ productName: req.body.productName, _id: { $nin: [req.body.id] } });
            if (find_prod) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var update_prod = await SubModel.updateOne({ _id: req.body.id }, req.body);
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.categoryUpdated,
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    deletesub: async (req, res) => {
        try {
            var delete_prod = await SubModel.deleteOne({ _id: req.params.id });
            if (delete_prod) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: true,
                    message: global.CONFIGS.api.categoryUpdated,
                })
            }
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    
}