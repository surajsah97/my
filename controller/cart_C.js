var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CartModel = mongoose.model(constants.CartModel);
const UserModel = mongoose.model(constants.UserModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {

    addTpCart: async (req, res) => {
        var find_user = await UserModel.findOne({_id:req.body.userId});
        if(!find_user){
            const err = new customError(global.CONFIGS.api.categoryalreadyadded, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        var find_cart = await CartModel.findOne({userId:req.body.userId});
        if(find_cart){
                var find_prod = await ProductModel.findOne({ _id: req.body.product[0].productId });
                if (!find_prod) {
                    const err = new customError(global.CONFIGS.api.categoryalreadyadded, global.CONFIGS.responseCode.notFound);
                    return next(err);
                }
                var price = find_prod.productPrice * req.body.product[0].qty;
                var finalPrice = price + find_cart.price;
                var totalProduct = [...find_cart.product, ...req.body.product];
                var update_cart = await CartModel.updateOne({_id : find_cart._id}, {
                    product:req.body.product,
                    price:finalPrice
                })
                var get_cart =await CartModel.findOne({_id : find_cart._id});
                return res.status(global.CONFIGS.responseCode.success).json({
                    success: true,
                    message: global.CONFIGS.api.categoryadded,
                    data: get_cart
                })
        }else if(!find_cart){
                var find_prod = await ProductModel.findOne({ _id: req.body.product[0].productId });
                if (!find_prod) {
                    const err = new customError(global.CONFIGS.api.categoryalreadyadded, global.CONFIGS.responseCode.notFound);
                    return next(err);
                }
                var price = find_prod.productPrice * req.body.product[0].qty;
                var create_cart = await CartModel.create({
                    userId:req.body.userId,
                    product:req.body.product,
                    price:price
                })
                return res.status(global.CONFIGS.responseCode.success).json({
                    success: true,
                    message: global.CONFIGS.api.categoryadded,
                    data: create_cart
                })

            // }
        }
    },
}