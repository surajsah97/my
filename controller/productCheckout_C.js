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
  //   productCheckout: async (req, res) => {
  //     try {
  //       let { trialActive, userId, productId, quantity } = req.body;
  //       console.log(req.body);
  //       if (!userId) {
  //         res.send({ status: "400", message: "userId require" });
  //       }
  //       console.log("....1");
  //       let userDetail = await UserModel.findOne({ _id: userId });
  //       console.log(userDetail, "....2");
  //       if (userDetail) {
  //         let obj = {};
  //         let order = {};
  //         let productsWithDetails = [];
  //         console.log(trialActive, "...trialActive");
  //         if (trialActive == true) {

  //       console.log(userDetail, "....userDetails");
  //           if (userDetail.trialActive && 3 - userDetail.trialQuantity >= quantity) {
  //             let totaltrialQuantity = userDetail.trialQuantity + quantity;
  //             console.log("..3");
  //             if (!productId) {
  //               return res.status(400).json({
  //                 success: false,
  //                 message: "productId is required for each product.",
  //               });
  //             }

  //             const product = await ProductModel.findById(productId);
  //             // console.log(product);
  //             if (!product) {
  //               return res.status(404).json({
  //                 success: false,
  //                 message: `Product with ID ${productId} not found.`,
  //               });
  //             }
  //             const productPrice = product.productPrice * quantity;
  //             console.log({ productPrice });
  //             obj.productName = product.productName;
  //             console.log("trial 000000000");
  //             obj.productId = product._id;
  //             console.log(" trial 1111111111");

  //             obj.productPrice = product.productPrice;
  //             console.log("trial 33333333333");

  //             obj.productImage = product.productImage;
  //             console.log("trial 444444444444444");

  //             obj.productUOM = product.productUOM;
  //             console.log("trial 55555555555");

  //             obj.productInventory = product.productInventory;
  //             console.log("trial 66666666666666666");

  //             obj.productInventory = product.productInventory;
  //             console.log("trial 7777777777777");

  //             obj.quantity = quantity;
  //             console.log("trial 888888888888888");

  //             // obj.totalPrice = productPrice;
  //             productsWithDetails.push(obj);
  //             console.log("trial 9999999999");

  //             console.log(productsWithDetails,"trial......productsWithDetails ")
  //             order.product = productsWithDetails;
  //             order.totalPrice = productPrice;
  //             order.userId = userId;
  //             console.log(order,"trial......order");

  //             // req.body.totalPrice = price;
  //             // req.body.product = productsWithDetails;
  //             // console.log(req.body)
  //             const create_prod = await ProductCheckOutModel.create(order);
  //             if (create_prod) {
  //               let userUpdate = await UserModel.findByIdAndUpdate(
  //                 { _id: userId },
  //                 {
  //                   trialQuantity: totaltrialQuantity,
  //                   trialActive: 3 - totaltrialQuantity >0 ? true : false,
  //                 }
  //               );
  //               console.log(userUpdate, "uuuuuuu");
  //               return res.status(global.CONFIGS.responseCode.success).json({
  //                 success: true,
  //                 message: global.CONFIGS.api.Productadded,
  //                 data: create_prod,
  //                 userdata:userUpdate
  //               });
  //             }
  //           // } else {
  //           //   res.send({ status: 400, message: "trialActive completed" });
  //           // }
  //         } else {
  //           if (!productId) {
  //             return res.status(400).json({
  //               success: false,
  //               message: "productId is required for each product.",
  //             });
  //           }

  //           const product = await ProductModel.findById(productId);
  //           console.log(product);
  //           if (!product) {
  //             return res.status(404).json({
  //               success: false,
  //               message: `Product with ID ${productId} not found.`,
  //             });
  //           }
  //           const productPrice = product.productPrice * quantity;
  //           console.log({ productPrice });
  //           obj.productName = product.productName;
  //           console.log("000000000");
  //           obj.productId = product._id;
  //           console.log("1111111111");

  //           obj.productPrice = product.productPrice;
  //           console.log("33333333333");

  //           obj.productImage = product.productImage;
  //           console.log("444444444444444");

  //           obj.productUOM = product.productUOM;
  //           console.log("55555555555");

  //           obj.productInventory = product.productInventory;
  //           console.log("66666666666666666");

  //           obj.productInventory = product.productInventory;
  //           console.log("7777777777777");

  //           obj.quantity = quantity;
  //           console.log("888888888888888");

  //           // obj.totalPrice = productPrice;
  //           productsWithDetails.push(obj);
  //           console.log("9999999999");

  //           // console.log(productsWithDetails)
  //           order.product = productsWithDetails;
  //           order.totalPrice = productPrice;
  //           order.userId = userId;
  //           console.log({ order });
  //           // req.body.totalPrice = price;
  //           // req.body.product = productsWithDetails;
  //           // console.log(req.body)
  //           const create_prod = await ProductCheckOutModel.create(order);
  //           console.log({ create_prod });
  //           if (create_prod) {
  //             return res.status(global.CONFIGS.responseCode.success).json({
  //               success: true,
  //               message: global.CONFIGS.api.Productadded,
  //               data: create_prod,
  //             });
  //           }
  //         }
  //       }
  //     }
  //     //  catch (err) {
  //     //   console.log({ err });
  //     // }
  //   } catch (error) {
  //       // console.log({ error });
  //       return res.status(500).json({ success: false, message: error.message });
  //     }
  // }

  productCheckout: async (req, res) => {
    try {
      let price = 0;
      let productsWithDetails = [];
      const { productId, quantity } = req.body;
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const productPrice = product.productPrice * quantity;
      price += productPrice;
       productsWithDetails.push({
      productName: product.productName,
      productId: product._id,
      productPrice: product.productPrice,
      productImage: product.productImage,
      quantity: quantity
    });
      req.body.totalPrice = price;
      req.body.product = productsWithDetails;
      const createProductCheckout = await ProductCheckOutModel.create(req.body);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Productadded,
        data: createProductCheckout,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** */
  // productCheckout: async (req, res) => {
  //   try {
  //     let price = 0;
  //     let productsWithDetails = [];

  //     for (let i = 0; i < req.body.product.length; i++) {
  //       let obj = {};
  //       const productId = req.body.product[i].productId;
  // const quantity = Number.parseInt(req.body.product[i].quantity);

  //       if (!productId) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "productId is required for each product.",
  //         });
  //       }

  //       const product = await ProductModel.findById(productId);
  //       // console.log(product)
  //       if (!product) {
  //         return res.status(404).json({
  //           success: false,
  //           message: `Product with ID ${productId} not found.`,
  //         });
  //       }
  //       const productPrice = product.productPrice * quantity;
  //       price += productPrice;

  //       obj.productName = product.productName;
  //       obj.productId = product._id;
  //       obj.productPrice = product.productPrice;
  //       obj.productImage = product.productImage;
  //       obj.productUOM = product.productUOM;
  //       obj.productInventory = product.productInventory;
  //       obj.productInventory = product.productInventory;
  //       obj.quantity = quantity;
  //       productsWithDetails.push(obj);
  //     }
  //     // console.log(productsWithDetails)
  //     req.body.totalPrice = price;
  //     req.body.product = productsWithDetails;
  //     // console.log(req.body)
  //     const create_prod = await ProductCheckOutModel.create(req.body);

  //     return res.status(global.CONFIGS.responseCode.success).json({
  //       success: true,
  //       message: global.CONFIGS.api.Productadded,
  //       data: create_prod,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, message: error.message });
  //   }
  // },
  /** */

  /** */
  //   productCheckout: async (req, res) => {
  //     try {
  //       let price = 0;
  //       let productsWithDetails = [];

  //       for (let i = 0; i < req.body.product.length; i++) {
  //         let obj = {};
  //         const productId = req.body.product[i].productId;
  //          const quantity = req.body.product[i].quantity;

  //         if (!productId) {
  //           return res.status(400).json({
  //             success: false,
  //             message: "productId is required for each product.",
  //           });
  //         }

  //         const product = await ProductModel.findById(productId);
  //         // console.log(product)
  //         if (!product) {
  //           return res.status(404).json({
  //             success: false,
  //             message: `Product with ID ${productId} not found.`,
  //           });
  //         }
  //         price += product.productPrice;
  //         obj.productName = product.productName;
  //         obj.productId = product._id;
  //         obj.productPrice = product.productPrice;
  //         obj.productImage = product.productImage;
  //         obj.productUOM = product.productUOM;
  //         obj.productInventory = product.productInventory;
  //         obj.productInventory = product.productInventory;

  //         productsWithDetails.push(obj);
  //       }
  //     // console.log(productsWithDetails)
  //       req.body.totalPrice = price;
  //       req.body.product = productsWithDetails;
  // // console.log(req.body)
  //       const create_prod = await ProductCheckOutModel.create(req.body);

  //       return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.Productadded,
  //         data: create_prod,
  //       });
  //     } catch (error) {
  //       return res.status(500).json({ success: false, message: error.message });
  //     }
  //   },
  /** */
};
