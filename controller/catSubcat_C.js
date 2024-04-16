var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CategoryModel = mongoose.model(constants.CategoryModel);
const SubCategoryModel = mongoose.model(constants.SubCategoryModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
  addCategoryAdmin: async (req, res, next) => {
    const categoryName = req.body.category.trim();
    const find_cat = await CategoryModel.findOne({ category: { $regex: new RegExp('^' + categoryName + '$', 'i') } });

    if (find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    if (req.files.categoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.categoryImg[0].filename}`;
      req.body.categoryImg = categoryImage;
    }
    const create_cat = await CategoryModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryadded,
      data: create_cat,
    });
  },

  updateCategoryAdmin: async (req, res, next) => {
    let find_cat = await CategoryModel.findById(req.params.id);
    if (!find_cat) {
      const err = new customError(global.CONFIGS.api.categoryInactive, global.CONFIGS.responseCode.notFound);
      return next(err);
    }
    if (req.files.categoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.categoryImg[0].filename}`;
      req.body.categoryImg = categoryImage;
    }
    let existing_cat = await CategoryModel.findOne({
      category: req.body.category,
      _id: { $nin: [req.params.id] },
    });
    if (existing_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["0", "1"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
        return next(err);
      }
    }
    find_cat = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryUpdated,
      find_cat,
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

  categoryDeleteAdmin: async (req, res, next) => {
    var delete_cat = await CategoryModel.findByIdAndDelete({ _id: req.params.id });
    if (!delete_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryDelete,
    });
  },

  // SubCat api //

  addSubCategoryAdmin: async (req, res, next) => {
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
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const subCategoryName = req.body.subCategory.trim();
    let find_Subcat = await SubCategoryModel.findOne({ subCategory: { $regex: new RegExp('^' + subCategoryName + '$', 'i') } });
    if (find_Subcat) {
      const err = new customError(
        global.CONFIGS.api.Subcategoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    const create_subcat = await SubCategoryModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Subcategoryadded,
      data: create_subcat,
    });
  },

  updateSubCategoryAdmin: async (req, res, next) => {
    if (req.files.subCategoryImg) {
      var categoryImage = `uploads/catsubcat/${req.files.subCategoryImg[0].filename}`;
      req.body.subCategoryImg = categoryImage;
    }
    let find_subCategory = await SubCategoryModel.findById(req.params.id);
    // console.log(find_subCategory,"....find_subCategory")
    if (!find_subCategory) {
      const err = new customError(global.CONFIGS.api.SubcategoryInactive, global.CONFIGS.responseCode.notFound);
      return next(err);
    }

    const existing_subCategory = await SubCategoryModel.findOne({
      subCategory: req.body.subCategory,
      _id: { $nin: [req.params.id] },
    });
    if (existing_subCategory) {
      const err = new customError(
        global.CONFIGS.api.Subcategoryalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    if (req.body.categoryId != undefined) {
      let find_category = await CategoryModel.findById(new ObjectId(req.body.categoryId));
      if (!find_category) {
        const err = new customError(global.CONFIGS.api.categoryInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
      }
    }

    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["0", "1"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
        return next(err);
      }
    }

    find_subCategory = await SubCategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.SubcategoryUpdated,
      data: find_subCategory
    });
  },

  SubcategoryListAdmin: async (req, res, next) => {
    let query={};
    if (req.query.categoryId != undefined) {
      query.categoryId = new ObjectId(req.query.categoryId);
    }
    if (req.query.activeStatus != undefined) {
      query.activeStatus = req.query.activeStatus;
    }
    let find_subcat = await SubCategoryModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      // { $unset: "categoryId" },
      {
        $sort: {
          subCategory: 1
        }
      },
      {
        $project: {
          _id: "$_id",
          categoryId: "$category._id",
          categoryName: "$category.category",
          subCategoryName: "$subCategory",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        }
      },
      {
        $facet: {
          metadata: [{ $count: "total" },],
          data: [],
        },
      },
    ]);

    if (find_subcat[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.SubcategoryNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const total = find_subcat[0].metadata[0].total
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allSubcategorylistAdmin,
      totalSubCategory: `${total} no of quantity`,
      data: find_subcat[0].data,
    });
  },


  SubcategoryListFront: async (req, res, next) => {
    var query = { activeStatus: "1" };
    if (req.query.categoryId != undefined) {
      query.categoryId = req.query.categoryId;
    }
    var find_cat = await SubCategoryModel.find(query);
    if (find_cat.length > 0) {
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.allSubcategorylistUser,
        data: find_cat,
      });
    } else {
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

  },
  singleSubCategoryByIdAdmin: async (req, res, next) => {
    var find_subCategory = await SubCategoryModel.findById(req.params.id);
    if (!find_subCategory) {
      const err = new customError(global.CONFIGS.api.SubcategoryInactive, global.CONFIGS.responseCode.notFound);
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.singleCategoryAdmin,
      data: find_subCategory,
    });
  },

  SubcategoryDeleteAdmin: async (req, res, next) => {
    var delete_subcategory = await SubCategoryModel.findByIdAndDelete({ _id: req.params.id });
    if (!delete_subcategory) {
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.SubcategoryDelete,
    })
  },
};
