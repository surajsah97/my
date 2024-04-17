var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductModel = mongoose.model(constants.ProductModel);
const CategoryModel = mongoose.model(constants.CategoryModel);
const SubCategoryModel = mongoose.model(constants.SubCategoryModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  addProduct: async (req, res, next) => {
    if (req.files) {
      req.body.productImage = `uploads/products/${req.files.productImage[0].originalname}`;
    }
    const find_cat = await CategoryModel.findOne({
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
    const find_Subcat = await SubCategoryModel.findOne({
      _id: req.body.subCategoryId,
      activeStatus: "1",
    });
    if (!find_Subcat) {
      const err = new customError(
        global.CONFIGS.api.SubcategoryInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const productName = req.body.productName.trim();
        const find_prod = await ProductModel.findOne({
            productName: { $regex: new RegExp('^' + productName + '$', 'i') }
        });
        if (find_prod) {
            const err = new customError(
                global.CONFIGS.api.Productalreadyadded,
                global.CONFIGS.responseCode.alreadyExist
            );
            return next(err);
        }
    const create_prod = await ProductModel.create({...req.body, productName});
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Productadded,
      data: create_prod,
    });
  },

  updateProduct: async (req, res, next) => {
    if (req?.files?.productImage) {
      const productImage = `uploads/catsubcat/${req.files.productImage[0].filename}`;
      req.body.productImage = productImage;
    }
    let find_prod = await ProductModel.findById(req.params.id);
    // console.log(find_subCategory,"....find_subCategory")
    if (!find_prod) {
      const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFound);
      return next(err);
    }

    const existing_product = await ProductModel.findOne({
      productName: req.body.productName,
      _id: { $nin: [req.params.id] },
    });
    if (existing_product) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    if (req.body.categoryId != undefined) {
      let find_category = await CategoryModel.findOne({_id:req.body.categoryId,activeStatus: "1"});
      if (!find_category) {
        const err = new customError(global.CONFIGS.api.categoryInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
      }
    }
    if (req.body.subCategoryId != undefined) {
      let find_subcategory = await SubCategoryModel.findOne({_id:req.body.subCategoryId,activeStatus: "1"});
      if (!find_subcategory) {
        const err = new customError(global.CONFIGS.api.SubcategoryInactive, global.CONFIGS.responseCode.notFound);
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
    
    find_prod = await ProductModel.findByIdAndUpdate(
      req.params.id ,
      req.body,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.ProductUpdated,
      data:find_prod
    });
  },

  deleteProduct: async (req, res, next) => {
    const delete_prod = await ProductModel.findByIdAndDelete({ _id: req.params.id });
    if (!delete_prod) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.ProductDelete,
      });
    
  },

  productListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    var query = { activeStatus: "1" };
    if (req.query.categoryId != undefined) {
      query.categoryId = new ObjectId(req.query.categoryId);
    }
    if (req.query.subCategoryId != undefined) {
      query.subCategoryId = new ObjectId(req.query.subCategoryId);
    }

    var productData = await ProductModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $unset: "categoryId" },
      {
        $lookup: {
          from: "subcategory",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      }, 
      { $unwind: "$subcategory" },
      { $unset: "subCategoryId" },
      {
        $project: {
          _id: "$_id",
          productName: "$productName",
          productImage: "$productImage",
          productDes: "$productDes",
          productPrice: "$productPrice",
          productUOM: "$productUOM",
          productInventory: "$productInventory",
          tagLine: "$tagLine",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          subCategory: "$subcategory.subCategory",
          category: "$category.category",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (productData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(
      parseInt(productData[0].metadata[0].total) / limit
    );
      const total = parseInt(productData[0].metadata[0].total);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalData:total,
      totalPage: totalPage,
      allOrder: productData[0].data,
    });
  },

  productListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    var query = { };
    if (req.query.activeStatus != undefined) {
      query.activeStatus = req.query.activeStatus;
    }
    if (req.query.categoryId != undefined) {
      query.categoryId = new ObjectId(req.query.categoryId);
    }
    if (req.query.subCategoryId != undefined) {
      query.subCategoryId = new ObjectId(req.query.subCategoryId);
    }
    var productData = await ProductModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $unset: "categoryId" },
      {
        $lookup: {
          from: "subcategory",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: "$subcategory" },
      { $unset: "subCategoryId" },
      {
        $project: {
          _id: "$_id",
          productName: "$productName",
          productImage: "$productImage",
          productDes: "$productDes",
          productPrice: "$productPrice",
          productUOM: "$productUOM",
          productInventory: "$productInventory",
          tagLine: "$tagLine",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          subCategory: "$subcategory.subCategory",
          category: "$category.category",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (productData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(
      parseInt(productData[0].metadata[0].total) / limit
    );
    const total = parseInt(productData[0].metadata[0].total);
    console.log(total,"..........");
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalData: total,
      totalPage: totalPage,
      allProduct: productData[0].data,
    });
  },
};
