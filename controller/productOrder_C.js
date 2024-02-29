var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductOrderModel = mongoose.model(constants.ProductOrderModel);
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const UserAddressModel = mongoose.model(constants.UserAddressModel);
const common = require("../service/commonFunction");

module.exports = {
  /** */

  //   productCheckout: async (req, res) => {
  //     try {
  //       let price = 0;
  //       let productsWithDetails = [];
  //       const { productId, quantity } = req.body;
  //       const product = await ProductModel.findById(productId);
  //       if (!product) {
  //         return res.status(404).json({ message: "Product not found" });
  //       }
  //       const productPrice = product.productPrice * quantity;
  //       price += productPrice;
  //        productsWithDetails.push({
  //       productName: product.productName,
  //       productId: product._id,
  //       productPrice: product.productPrice,
  //       productImage: product.productImage,
  //       quantity: quantity
  //     });
  //       req.body.totalPrice = price;
  //       req.body.product = productsWithDetails;
  //       const createProductCheckout = await ProductCheckOutModel.create(req.body);
  //       return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.Productadded,
  //         data: createProductCheckout,
  //       });
  //     } catch (error) {
  //       return res.status(500).json({ success: false, message: error.message });
  //     }
  //   },

  /** */
  createOrder: async (req, res) => {
    try {
      //   let productsWithDetails = [];
      //   let price = 0;
      const { userId } = req.body;
      console.log(userId, ".........userId");
      const checkOutdata = await ProductCheckOutModel.findOne({ userId }).sort({
        _id: -1,
      });
      console.log(checkOutdata, ".......checkOutData");
      const product = checkOutdata.product;
      console.log(product, "........product");
      const totalPrice = checkOutdata.totalPrice;
      console.log(totalPrice, "...........totalPrice");

      const userAddress = await UserAddressModel.findOne(
        { userId },
        { _id: -1 }
      ).sort({ _id: -1 });
      console.log(userAddress, "........userAddress");
      req.body.product = product;
      req.body.addressId = userAddress._id;
      console.log(req.body, "......body");
      const createProductOrder = await ProductOrderModel.create(req.body);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Productadded,
        data: createProductOrder,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },



   orderListByAdmin: async (req, res, next) => {
    var findAllUser = await ProductOrderModel.find().sort({ _id: -1 });
    var totalOrder = findAllUser.length;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      totalOrder,
      data: findAllUser,
    });
  },
};
