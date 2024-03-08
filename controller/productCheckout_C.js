var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const UserModel = mongoose.model(constants.UserModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const CartModel = mongoose.model(constants.CartModel);

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


  /** */

  productCheckout: async (req, res, next) => {
    try {
      let { userId } = req.body;
      // console.log(req.body);
      if (!userId) {
        res.send({ status: "400", message: "userId require" });
      }
      // console.log("....1");
      let userDetail = await UserModel.findOne({ _id: userId });
      // console.log(userDetail, "....userDetail...2");
      if (userDetail) {
        // console.log(userDetail.trialActive, "...trialActive..3");
        let find_cart = await CartModel.findOne({ userId: req.body.userId });
        // console.log(find_cart, "......find_cart...4")

        if (find_cart) {
          var qtyInCart = find_cart.product.map((item) => item.qty)
            .reduce((accumulator, currentValue) => {
              return accumulator + currentValue;
            }, 0);
          // console.log(qtyInCart, "..qtyInCart...5");
          const product = find_cart.product;
          // console.log(product, "........product....6");
          // const totalPrice = find_cart.price;
          // console.log(totalPrice, "...........totalPrice......7");
          if (userDetail.trialActive == true) {
            let remainingTrialQuantity = 3 - userDetail.trialQuantity;
            if (userDetail.trialActive && remainingTrialQuantity >= qtyInCart) {
              let totaltrialQuantity = userDetail.trialQuantity + qtyInCart;
              // console.log(totaltrialQuantity, "....totaltrialQuantity...8");
              // console.log(product, "....product...9")
              if (!product) {
                return res.status(400).json({
                  success: false,
                  message: "productId is required for each product.",
                });
              }
              req.body.product = product;
              req.body.vat = 0;
              req.body.totalPrice = 0;
              req.body.totalTaxablePrice = 0;
              // req.body.totalPrice = totalPrice;
              req.body.userId = userId;
              // console.log(req.body, "...req.body......end");
              const create_Checkout = await ProductCheckOutModel.create(req.body);
              if (create_Checkout) {
                let userUpdate = await UserModel.findByIdAndUpdate(
                  { _id: userId },
                  {
                    trialQuantity: totaltrialQuantity,
                    trialActive: 3 - totaltrialQuantity > 0 ? true : false,
                  }, {
                  new: true,
                  runValidators: true,
                  useFindAndModify: false,
                }
                );
                // console.log(userUpdate, "uuuuuuu");
                return res.status(global.CONFIGS.responseCode.success).json({
                  success: true,
                  message: global.CONFIGS.api.Productadded,
                  data: create_Checkout,
                  userdata: userUpdate
                });
              }
            }
            else if (userDetail.trialActive && remainingTrialQuantity < qtyInCart) {
              console.log((userDetail.trialActive && remainingTrialQuantity < qtyInCart), ".....w")

              let totaltrialQuantity = userDetail.trialQuantity + remainingTrialQuantity;
              console.log(totaltrialQuantity, "....totaltrialQuantity...8");
              console.log(product, "....product...9")
              if (!product) {
                return res.status(400).json({
                  success: false,
                  message: "productId is required for each product.",
                });
              }
              const totalPrice = find_cart.price;
              const remainQuantity = qtyInCart - remainingTrialQuantity;
              const vat = 5;
              console.log(remainQuantity, "......remainQuantity");
              const qtyInCartPrice = totalPrice / qtyInCart;
              console.log(qtyInCartPrice, "......qtyInCartPrice");
              const bodyTotalPrice=remainQuantity * qtyInCartPrice;
              console.log(totalPrice, "...........totalPrice......7");
              const taxAmount = bodyTotalPrice * (vat/100);
              const totalTaxablePrice = bodyTotalPrice + taxAmount;
              req.body.product = product;
              req.body.totalPrice =Math.round(bodyTotalPrice) ;
              req.body.vatAmount =Math.round(taxAmount) ;
              req.body.totalTaxablePrice =Math.round(totalTaxablePrice) ;
              req.body.userId = userId;
              console.log(req.body, "...req.body......end");
              const create_Checkout = await ProductCheckOutModel.create(req.body);
              if (create_Checkout) {
                let userUpdate = await UserModel.findByIdAndUpdate(
                  { _id: userId },
                  {
                    trialQuantity: totaltrialQuantity,
                    trialActive: 3 - totaltrialQuantity > 0 ? true : false,
                  }, {
                  new: true,
                  runValidators: true,
                  useFindAndModify: false,
                }
                );
                // console.log(userUpdate, "uuuuuuu");
                return res.status(global.CONFIGS.responseCode.success).json({
                  success: true,
                  message: global.CONFIGS.api.Productadded,
                  data: create_Checkout,
                  userdata: userUpdate
                });
              }
            }
          }
          else {
            console.log("mradul....")
            // let qtyInCart = find_cart.product.map((item) => item.qty)
            // .reduce((accumulator, currentValue) => {
            //   return accumulator + currentValue;
            // }, 0);
            // console.log(qtyInCart, "..qtyInCart...5");
            // const product = find_cart.product;
            // console.log(product, "........product....6");
            const totalPrice = find_cart.price;
            const vat = 5;
            const taxAmount = totalPrice * (vat/100);
            const totalTaxablePrice = totalPrice + taxAmount;
            // console.log(totalPrice, "...........totalPrice......7");
            console.log(product, "......product.....xxxxx")
            if (!product) {
              return res.status(400).json({
                success: false,
                message: "productId is required for each product.",
              });
            }
            req.body.product = product;
            req.body.vatAmount = Math.round(taxAmount);
            req.body.totalPrice = Math.round(totalPrice);
            req.body.totalTaxablePrice = Math.round(totalTaxablePrice);
            req.body.userId = userId;
            console.log(req.body, "...req.body......end");
            const create_Checkout = await ProductCheckOutModel.create(req.body);
            if (create_Checkout) {
              return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.Productadded,
                data: create_Checkout,
              });
            }
          }
          // }
        }
      }
      //  catch (err) {
      //   console.log({ err });
      // }
    } catch (error) {
      // console.log({ error });
      return res.status(500).json({ success: false, message: error.message });
    }
  },


};
