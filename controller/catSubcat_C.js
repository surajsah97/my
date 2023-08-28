var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CategoryModel = mongoose.model(constants.CategoryModel);
const common = require("../service/commonFunction");

module.exports = {
    addCategory: async (req, res) => {
        try {
            var find_cat = await CategoryModel.findOne({ category: req.body.category });
            if (find_cat) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var create_cat = await CategoryModel.create(req.body);
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.categoryadded,
                data: create_cat
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })    
        }
    },

    updateCategory: async (req, res) => {
        try {
            var find_cat = await CategoryModel.findOne({ category: req.body.category, _id: { $nin: [req.body.id] }  });
            if (find_cat) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var create_cat = await CategoryModel.updateOne({_id:req.body.id},req.body);
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

    categoryList: async (req, res) => {
        try {
            var find_cat = await CategoryModel.find({});
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.categoryUpdated,
                data: find_cat
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },
    
}