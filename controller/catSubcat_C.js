var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CategoryModel = mongoose.model(constants.CategoryModel);
const SubCategoryModel = mongoose.model(constants.SubCategoryModel);
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

    categoryListFront: async (req, res) => {
        try {
            var find_cat = await CategoryModel.find({ activeStatus :"1"});
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

    categoryDelete: async (req, res) => {
        try {
            var find_cat = await CategoryModel.deleteOne({_id:req.params.id});
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.categoryDelete,
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },


     // SubCat api //
    
    addSubCategory: async (req, res) => {
        try {
            var find_cat = await CategoryModel.findOne({ _id: req.body.categoryId, activeStatus:"1" });
            if (!find_cat) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryInactive,
                })
            }
            var find_Subcat = await SubCategoryModel.findOne({ subCategory: req.body.subCategory });
            if (find_Subcat) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.Subcategoryalreadyadded,
                })
            }
            var create_subcat = await SubCategoryModel.create(req.body);
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.Subcategoryadded,
                data: create_subcat
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    updateSubCategory: async (req, res) => {
        try {
            var find_cat = await SubCategoryModel.findOne({ category: req.body.category, _id: { $nin: [req.body.id] } });
            if (find_cat) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.Subcategoryalreadyadded,
                })
            }
            var create_cat = await SubCategoryModel.updateOne({ _id: req.body.id }, req.body);
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.SubcategoryUpdated,
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    SubcategoryList: async (req, res) => {
        try {
            var find_cat = await SubCategoryModel.find({});
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.SubcategoryUpdated,
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

    SubcategoryListFront: async (req, res) => {
        try {
            var find_cat = await SubCategoryModel.find({ activeStatus: "1" });
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.SubcategoryUpdated,
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

    SubcategoryDelete: async (req, res) => {
        try {
            var find_cat = await SubCategoryModel.deleteOne({ _id: req.params.id });
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.SubcategoryDelete,
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