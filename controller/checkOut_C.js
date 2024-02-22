var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const CheckOutModel = mongoose.model(constants.CheckOutModel);
const subscriptionPlanModel = mongoose.model(constants.subscriptionPlanModel);
const ProductModel = mongoose.model(constants.ProductModel);
const common = require("../service/commonFunction");

module.exports = {

    checkOut: async (req, res) => {
        var price = 0;
        for (var i = 0; i < req.body.product.length; i++){
            var find_prod = await ProductModel.findOne({ _id: req.body.product[i].productId });
            if (find_prod) {
                price += find_prod.productPrice;
            }
        }
        var find_subplan = await subscriptionPlanModel.findOne({ _id: req.body.subDurationId });
        if (find_prod) {
            var totaldays = parseInt(parseInt(find_subplan.planDuration) * 30);
            price = parseFloat(parseInt(totaldays) * parseFloat(price));
        }
        if (price > 0) {
            req.body.price = price;
        }
        
        var create_prod = await CheckOutModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_prod
        })
    },
}