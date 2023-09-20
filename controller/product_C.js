var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");

module.exports = {
    addProduct: async (req, res) => {
        try {
            if (req.files) {
                // console.log(req.files)
                req.body.productImage = `uploads/${req.files.productImage[0].originalname}`
            }
            var find_prod = await ProductModel.findOne({ productName: req.body.productName });
            if (find_prod) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var create_prod = await ProductModel.create(req.body);
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

    updateProduct: async (req, res) => {
        try {
            var find_prod = await ProductModel.findOne({ productName: req.body.productName, _id: { $nin: [req.body.id] } });
            if (find_prod) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.categoryalreadyadded,
                })
            }
            var update_prod = await ProductModel.updateOne({ _id: req.body.id }, req.body);
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

    deleteProduct: async (req, res) => {
        try {
            var delete_prod = await ProductModel.deleteOne({ _id: req.params.id });
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

    productListFront: async (req, res) => {
        try {
            var productData = await ProductModel.aggregate([
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
                { $unwind: '$subcategory'},
                { $unset: 'subCategoryId' },
                { $project: { _id: "$_id", productName: "$productName", productImage: "$productImage", productPrice: "$productPrice", productUOM: "$productUOM", productDes: "$productDes", productInventory: "$productInventory", activeStatus: "$activeStatus", createdAt: "$createdAt", updatedAt: "$updatedAt", subCategory: "$subcategory.subCategory", category: "$category.category" } }
                
            ]);
            res.send(productData);
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    productListAdmin: async (req, res) => {
        try {
            var productData = await ProductModel.aggregate([
                
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
                { $project: { _id: "$_id", productName: "$productName", productImage: "$productImage", productPrice: "$productPrice", productUOM: "$productUOM", productDes: "$productDes", productInventory: "$productInventory", activeStatus: "$activeStatus", createdAt: "$createdAt", updatedAt: "$updatedAt", subCategory: "$subcategory.subCategory", category: "$category.category" } }

            ]);
            res.send(productData);
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },
}