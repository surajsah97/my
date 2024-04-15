var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CategoryModel = mongoose.model(constants.CategoryModel);
const SubCategoryModel = mongoose.model(constants.SubCategoryModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");


module.exports = {
  addCategory: async (req, res, next) => {
    if (req.files.categoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.categoryImg[0].filename}`;
      req.body.categoryImg = categoryImage;
    }
    var find_cat = await CategoryModel.findOne({ category: req.body.category.toLowerCase() });
    if (find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_cat = await CategoryModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryadded,
      data: create_cat,
    });
  },

  updateCategory: async (req, res, next) => {
    if (req.files.categoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.categoryImg[0].filename}`;
      req.body.categoryImg = categoryImage;
    }
    var find_cat = await CategoryModel.findOne({
      category: req.body.category,
      _id: { $nin: [req.params.id] },
    });
    if (find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var categoryUpdated = await CategoryModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    // var categoryUpdated = await CategoryModel.updateOne({ _id: req.params.id},req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryUpdated,
      categoryUpdated,
    });
  },

  categoryListAdmin: async (req, res, next) => {
    var find_cat = await CategoryModel.find({});
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allcategorylistAdmin,
      data: find_cat,
    });
  },
  singleCategoryByIdAdmin: async (req, res, next) => {
    var find_cat = await CategoryModel.findById(req.params.id);
     if (!find_cat) {
        const err = new customError(global.CONFIGS.api.categoryInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.singleCategoryAdmin,
      data: find_cat,
    });
  },

  categoryListFront: async (req, res, next) => {
    var find_cat = await CategoryModel.find({ activeStatus: "1" });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allcategorylistUser,
      data: find_cat,
    });
  },

  categoryDelete: async (req, res, next) => {
    var find_cat = await CategoryModel.deleteOne({ _id: req.params.id });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryDelete,
    });
  },

  // SubCat api //

  addSubCategory: async (req, res, next) => {
    if (req.files.subCategoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.subCategoryImg[0].filename}`;
      req.body.subCategoryImg = categoryImage;
    }
    var find_cat = await CategoryModel.findOne({
      _id: req.body.categoryId,
      activeStatus: "1",
    });
    if (!find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryInactive,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var find_Subcat = await SubCategoryModel.findOne({
      subCategory: req.body.subCategory,
    });
    if (find_Subcat) {
      const err = new customError(
        global.CONFIGS.api.Subcategoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_subcat = await SubCategoryModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Subcategoryadded,
      data: create_subcat,
    });
  },

  updateSubCategory: async (req, res, next) => {
    if (req.files.subCategoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.subCategoryImg[0].filename}`;
      req.body.subCategoryImg = categoryImage;
    }
    var find_cat = await SubCategoryModel.findOne({
      subCategory: req.body.subCategory,
      _id: { $nin: [req.params.id] },
    });
    if (find_cat) {
      const err = new customError(
        global.CONFIGS.api.Subcategoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_cat = await SubCategoryModel.updateOne(
      { _id: req.params.id },
      req.body
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.SubcategoryUpdated,
    });
  },

  SubcategoryListAdmin: async (req, res, next) => {
    var find_cat = await SubCategoryModel.find({});
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allSubcategorylistAdmin,
      data: find_cat,
    });
  },

  SubcategoryListFront: async (req, res, next) => {
    var query = { activeStatus: "1" };
    if (req.query.categoryId != undefined) {
      query.categoryId = req.query.categoryId;
    }
    var find_cat = await SubCategoryModel.find(query);
    if(find_cat.length>0){
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.allSubcategorylistUser,
        data: find_cat,
      });
    }else{
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    
  },

  SubcategoryDelete: async (req, res, next) => {
    var find_cat = await SubCategoryModel.deleteOne({ _id: req.params.id });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.SubcategoryDelete,
    });
  },
};
