var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");

module.exports = {
  //   productCheckout: async (req, res) => {
  //     try {
  //       let price = 0;
  //       for (let i = 0; i < req.body.product.length; i++) {
  //         const productId = req.body.product[i].productId;
  //          if (!productId) {
  //           return res
  //             .status(400)
  //             .json({
  //               success: false,
  //               message: "productId is required for each product.",
  //             });
  //         }

  //         const product = await ProductModel.findById(productId);

  //         if (!product) {
  //           return res
  //             .status(404)
  //             .json({
  //               success: false,
  //               message: `Product with ID ${productId} not found.`,
  //             });
  //         }
  //         price += product.productPrice;
  //       }

  //       req.body.totalPrice = price;

  //       const create_prod = await ProductCheckOutModel.create(req.body);

  //       return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message:global.CONFIGS.api.Productadded,
  //         data: create_prod,
  //       });
  //     } catch (error) {
  //       return res.status(500).json({ success: false, message: error.message });
  //     }
  //   },

  /** */
  productCheckout: async (req, res) => {
    try {
      let price = 0;
      let productsWithDetails = [];

      for (let i = 0; i < req.body.product.length; i++) {
        let obj = {};
        const productId = req.body.product[i].productId;

        if (!productId) {
          return res.status(400).json({
            success: false,
            message: "productId is required for each product.",
          });
        }

        const product = await ProductModel.findById(productId);
        // console.log(product)
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${productId} not found.`,
          });
        }
        price += product.productPrice;
        obj.productName = product.productName,
        obj.productId = product._id,
        obj.productPrice = product.productPrice,
        obj.productImage = product.productImage,
        obj.categoryId = product.categoryId,
        obj.subCategoryId = product.subCategoryId,
        obj.productUOM = product.productUOM,
        obj.productDes = product.productDes,
        obj.productInventory = product.productInventory,
        productsWithDetails.push(obj);
      }
    // console.log(productsWithDetails)
      req.body.totalPrice = price;
      req.body.product = productsWithDetails;
// console.log(req.body)
      const create_prod = await ProductCheckOutModel.create(req.body);

      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Productadded,
        data: create_prod,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  /** */
};
