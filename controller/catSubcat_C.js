var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CategoryModel = mongoose.model(constants.CategoryModel);
const SubCategoryModel = mongoose.model(constants.SubCategoryModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;
const qrCode = require("qrcode");
const path = require('path');

module.exports = {

  addCategoryAdminOld: async (req, res, next) => {
    const categoryName = req.body.category.trim();
    const find_cat = await CategoryModel.findOne({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") },
    });
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

  addCategoryAdmin: async (req, res, next) => {
    const categoryName = req.body.category.trim();
    const find_cat = await CategoryModel.findOne({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") },
    });
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
    // console.log(create_cat, ".......1")
    // const qrCodeData = await qrCode.toDataURL(JSON.stringify(create_cat),);
    // console.log(qrCodeData, ".......2")
    // create_cat.qrCodeData = qrCodeData;
    const qrCodePath = `uploads/bikeqrcode/${create_cat._id}.png`;
    const absoluteQrCodePath = path.join(__dirname, '../public', qrCodePath);
    await qrCode.toFile(absoluteQrCodePath, JSON.stringify(create_cat));
    console.log(absoluteQrCodePath, ".......2");
    create_cat.qrCodeData = qrCodePath;
    await create_cat.save();
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryadded,
      data: create_cat,
    });
  },

  updateCategoryAdmin: async (req, res, next) => {
    let find_cat = await CategoryModel.findById(req.params.id);
    if (!find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (req?.files?.categoryImg) {
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
        const err = new customError(
          "invalid activeStatus Allowed values are: 0,1",
          global.CONFIGS.responseCode.invalidInput
        );
        return next(err);
      }
    }
    find_cat = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.categoryUpdated,
      find_cat,
    });
  },

  categoryListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const skip = (pageNo - 1) * limit;
    var query = {};
    const searchText = req.query.searchText;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (req.query.activeStatus != undefined) {
      query.activeStatus = req.query.activeStatus;
    }
    if (searchText !== undefined) {
      query.$or = [
        { category: { $regex: new RegExp(searchText), $options: "i" } },
      ];
    }
    if (startDate != undefined && endDate != undefined) {
      // console.log({ $gt: new Date(startDate), $lt: new Date(endDate) })
      query.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    if (startDate != undefined && endDate == undefined) {
      // console.log({ $gt: new Date(startDate) })
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (startDate == undefined && endDate != undefined) {
      // console.log({  $lt: new Date(endDate) })
      query.createdAt = { $lte: new Date(endDate) };
    }
    console.log(query);
    var find_cat = await CategoryModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          _id: "$_id",
          categoryName: "$category",
          categoryImage: "$categoryImg",
          qrCodeData: "$qrCodeData",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (find_cat[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(find_cat[0].metadata[0].total) / limit);
    const total = parseInt(find_cat[0].metadata[0].total);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allcategorylistAdmin,
      totalData: total,
      totalPage: totalPage,
      allCategory: find_cat[0].data,
    });
  },

  singleCategoryByIdAdmin: async (req, res, next) => {
    var find_cat = await CategoryModel.findById(req.params.id);
    if (!find_cat) {
      const err = new customError(
        global.CONFIGS.api.categoryInactive,
        global.CONFIGS.responseCode.notFound
      );
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
    var delete_cat = await CategoryModel.findByIdAndDelete({
      _id: req.params.id,
    });
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
    let find_Subcat = await SubCategoryModel.findOne({
      subCategory: { $regex: new RegExp("^" + subCategoryName + "$", "i") },
    });
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
    if (req?.files?.subCategoryImg) {
      const subCategoryImage = `uploads/catsubcat/${req.files.subCategoryImg[0].filename}`;
      req.body.subCategoryImg = subCategoryImage;
    }
    let find_subCategory = await SubCategoryModel.findById(req.params.id);
    // console.log(find_subCategory,"....find_subCategory")
    if (!find_subCategory) {
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.notFound
      );
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
      let find_category = await CategoryModel.findOne({
        _id: req.body.categoryId,
        activeStatus: "1",
      });
      if (!find_category) {
        const err = new customError(
          global.CONFIGS.api.categoryInactive,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
    }

    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["0", "1"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError(
          "invalid activeStatus Allowed values are: 0,1",
          global.CONFIGS.responseCode.invalidInput
        );
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
      data: find_subCategory,
    });
  },

  SubcategoryListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const skip = (pageNo - 1) * limit;
    const searchText = req.query.searchText;
    const categoryId = req.query.categoryId;
    const activeStatus = req.query.activeStatus;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let query = {};
    if (categoryId != undefined) {
      query.categoryId = new ObjectId(categoryId);
    }
    if (activeStatus != undefined) {
      query.activeStatus = activeStatus;
    }
    if (searchText !== undefined) {
      query.$or = [
        { subCategory: { $regex: new RegExp(searchText), $options: "i" } },
        {
          "category.category": {
            $regex: new RegExp(searchText),
            $options: "i",
          },
        },
      ];
    }
    if (startDate != undefined && endDate != undefined) {
      query.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    if (startDate != undefined && endDate == undefined) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (startDate == undefined && endDate != undefined) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    console.log(query);
    let find_subcat = await SubCategoryModel.aggregate([
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $match: query,
      },

      {
        $sort: {
          subCategory: 1,
        },
      },
      {
        $project: {
          _id: "$_id",
          categoryId: "$category._id",
          categoryName: "$category.category",
          subCategoryName: "$subCategory",
          subCategoryImage: "$subCategoryImg",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
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

    const total = find_subcat[0].metadata[0].total;
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
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.singleSubCategoryAdmin,
      data: find_subCategory,
    });
  },

  SubcategoryDeleteAdmin: async (req, res, next) => {
    var delete_subcategory = await SubCategoryModel.findByIdAndDelete({
      _id: req.params.id,
    });
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
    });
  },
};
