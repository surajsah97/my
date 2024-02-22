var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const ProductCheckOutModel = mongoose.model(constants.ProductCheckOutModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");

module.exports = {
  productCheckout: async (req, res) => {
    var price = 0;
    for (var i = 0; i < req.body.product.length; i++) {
      var find_prod = await ProductModel.findOne({
        _id: req.body.product[i].productId,
      });
      if (find_prod) {
        price += find_prod.productPrice;
      }
    }

    console.log(req.body);
   
    var create_prod = await ProductCheckOutModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Productadded,
      data: create_prod,
    });
  },
};