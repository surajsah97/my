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
  productCheckout: async (req, res, next) => {
    try {
      let { userId } = req.body;
      if (!userId) {
        return res
          .status(400)
          .json({ status: "400", message: "userId required" });
      }
      let userDetail = await UserModel.findOne({ _id: userId });
      if (userDetail) {
        let find_cart = await CartModel.findOne({ userId: req.body.userId });
        if (find_cart) {
          const product = find_cart.product;
          if (!product) {
            return res.status(400).json({
              success: false,
              message: "productId is required for each product.",
            });
          }
          const productIds = product.map((item) => item.productId.toString());
          const productDetails = await ProductModel.find({
            _id: { $in: productIds },
          });
          let productPrice = {};
          productDetails.map((el) => {
            productPrice[el._id] = el.productPrice;
          });
          let totalAmount = 0;
          if (userDetail.trialActive == true) {
            let remainingTrialQuantity = 3 - userDetail.trialQuantity;
            let freeItem = [];
            let payableItem = [];
            let quant = remainingTrialQuantity;
            find_cart.product.map((cart) => {
              if (cart.qty <= quant) {
                freeItem.push({ ...cart });
                payableItem.push({ ...cart });
                quant -= cart.qty;
              } else if (quant > 0 && cart.qty > quant) {
                freeItem.push({ ...cart, qty: quant });
                payableItem.push({ ...cart });
                totalAmount +=
                  productPrice[cart.productId] * (cart.qty - quant);
                quant = 0;
              } else {
                payableItem.push({ ...cart });
                totalAmount += productPrice[cart.productId] * cart.qty;
              }
            });
            let totaltrialQuantity =
              userDetail.trialQuantity + remainingTrialQuantity - quant;
            let checkoutCart = {};
            const vat = 5;
            const taxAmount = totalAmount * (vat / 100);
            const totalTaxablePrice = totalAmount + taxAmount;
            checkoutCart.vatAmount = Math.round(taxAmount);
            checkoutCart.totalPrice = Math.round(totalAmount);
            checkoutCart.product = payableItem;
            checkoutCart.totalTaxablePrice = Math.round(totalTaxablePrice);
            checkoutCart.userId = userId;
            checkoutCart.freeProduct = freeItem;

            const create_Checkout = await ProductCheckOutModel.create(
              checkoutCart
            );
            if (create_Checkout) {
              // let userUpdate = await UserModel.findByIdAndUpdate(
              //   { _id: userId },
              //   {
              //     trialQuantity: totaltrialQuantity,
              //     trialActive: 3 - totaltrialQuantity > 0 ? true : false,
              //   },
              //   {
              //     new: true,
              //     runValidators: true,
              //     useFindAndModify: false,
              //   }
              // ).select("name email mobile isVerified userType activeStatus trialActive trialQuantity");

              let userdata = await UserModel.find({ _id: userId }).select("name email mobile isVerified userType activeStatus trialActive trialQuantity");

              return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.Productadded,
                data: create_Checkout,
                // userdata: userUpdate,
                userdata: userdata,
              });
            }
          } else {
            /*
          !THIRD CONDITION */
            console.log("ttyuiopoiu");
            let checkoutCart = {};
            let totalPrice = 0;
            find_cart.product.map((cart) => {
              totalPrice += productPrice[cart.productId] * cart.qty;
            });
            const vat = 5;
            const taxAmount = totalPrice * (vat / 100);
            const totalTaxablePrice = totalPrice + taxAmount;
            checkoutCart.vatAmount = Math.round(taxAmount);
            checkoutCart.totalPrice = Math.round(totalPrice);
            checkoutCart.product = product;
            checkoutCart.totalTaxablePrice = Math.round(totalTaxablePrice);
            checkoutCart.userId = userId;
            const create_Checkout = await ProductCheckOutModel.create(
              checkoutCart
            );
            if (create_Checkout) {
              let userdata = await UserModel.find({ _id: userId }).select("name email mobile isVerified userType activeStatus trialActive trialQuantity");
              return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.Productadded,
                data: create_Checkout,
                userdata: userdata,
              });
            }
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
