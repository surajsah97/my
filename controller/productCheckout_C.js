var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const UserModel = mongoose.model(constants.UserModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");

module.exports = {
  
  /** */
// productCheckout : async (req, res) => {
//     try {
//         let { products } = req.body;
//         let totalPrice = 0;
//         let productsWithDetails = [];

//         if (!products || !Array.isArray(products) || products.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Products array is required with each product containing productId and quantity.",
//             });
//         }

//         for (let i = 0; i < products.length; i++) {
//             const { productId, quantity } = products[i];

//             if (!productId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "productId is required for each product.",
//                 });
//             }

//             const product = await ProductModel.findById(productId);

//             if (!product) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Product with ID ${productId} not found.`,
//                 });
//             }

//             const productPrice = product.productPrice * quantity;
//             totalPrice += productPrice;

//             productsWithDetails.push({
//                 productId: product._id,
//                 productName: product.productName,
//                 productPrice: product.productPrice,
//                 productImage: product.productImage,
//                 quantity: quantity,
//             });
//         }

//         req.body.totalPrice = totalPrice;
//         req.body.product = productsWithDetails;

//         const create_prod = await ProductCheckOutModel.create(req.body);

//         return res.status(global.CONFIGS.responseCode.success).json({
//             success: true,
//             message: global.CONFIGS.api.Productadded,
//             data: create_prod,
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// } 


productCheckout :async (req, res) => {
    try {
        let { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products array is required with each product containing productId and quantity.",
            });
        }

        const productsWithDetails = [];
        let totalPrice = 0;

        for (const product of products) {
            const { productId, quantity } = product;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: "productId is required for each product.",
                });
            }

            const foundProduct = await ProductModel.findById(productId);

            if (!foundProduct) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${productId} not found.`,
                });
            }

            const productPrice = foundProduct.productPrice * quantity;
            totalPrice += productPrice;

            productsWithDetails.push({
                productId: foundProduct._id,
                productName: foundProduct.productName,
                productPrice: foundProduct.productPrice,
                productImage: foundProduct.productImage,
                quantity: quantity,
            });
        }

        const productCheckoutData = {
            userId: req.body.userId,
            product: productsWithDetails,
            totalPrice: totalPrice,
            activeStatus: req.body.activeStatus || 'Active', // Assuming you have activeStatus in your request body
        };

        const create_prod = await ProductCheckOutModel.create(productCheckoutData);

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_prod,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
    },

};
