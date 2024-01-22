var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckModel = mongoose.model(constants.TruckModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {
    addProduct: async (req, res, next) => {
        if (req.files) {
            req.body.productImage = `uploads/${req.files.productImage[0].originalname}`
        }
        var find_prod = await TruckModel.findOne({ productName: req.body.productName });
        if (find_prod) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var create_prod = await TruckModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_prod
        })
    },

    updateProduct: async (req, res, next) => {
        var find_prod = await TruckModel.findOne({ productName: req.body.productName, _id: { $nin: [req.params.id] } });
        if (find_prod) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var update_prod = await TruckModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.ProductUpdated,
        })
    },

    deleteProduct: async (req, res, next) => {
        var delete_prod = await TruckModel.deleteOne({ _id: req.params.id });
        if (delete_prod) {
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.ProductDelete,
            })
        }
    },

    productListFront: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;

        var productData = await TruckModel.aggregate([
            {
                $match: { activeStatus: "1" }
            },
            {
                $lookup:
                {
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: '$category' },
            { $unset: 'categoryId' },
            {
                $lookup:
                {
                    from: "subcategory",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            { $unwind: '$subcategory' },
            { $unset: 'subCategoryId' },
            { $project: { _id: "$_id", productName: "$productName", productImage: "$productImage", productPrice: "$productPrice", productUOM: "$productUOM", productDes: "$productDes", productInventory: "$productInventory", activeStatus: "$activeStatus", createdAt: "$createdAt", updatedAt: "$updatedAt", subCategory: "$subcategory.subCategory", category: "$category.category" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (productData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFoud);
            next(err);
        }
        var totalPage = Math.ceil(parseInt(productData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: productData[0].data
        })
    },

    productListAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;
        var productData = await TruckModel.aggregate([

            {
                $lookup:
                {
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: '$category' },
            { $unset: 'categoryId' },
            {
                $lookup:
                {
                    from: "subcategory",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            { $unwind: '$subcategory' },
            { $unset: 'subCategoryId' },
            { $project: { _id: "$_id", productName: "$productName", productImage: "$productImage", productPrice: "$productPrice", productUOM: "$productUOM", productDes: "$productDes", productInventory: "$productInventory", activeStatus: "$activeStatus", createdAt: "$createdAt", updatedAt: "$updatedAt", subCategory: "$subcategory.subCategory", category: "$category.category" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (productData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFoud);
            next(err);
        }
        var totalPage = Math.ceil(parseInt(productData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: productData[0].data
        })
    },
}