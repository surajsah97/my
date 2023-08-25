var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var constants = require("../models/modelConstants");
var UserModel = mongoose.model(constants.UserModel);


const apiValidateToken = async function (req, res, next) {
    var accessToken = req.headers['access-token'];
    try {
        
        var decode = await jwt.verify(accessToken, process.env.SECRETKEY);
        
            var find_user = await UserModel.findOne({ _id: decode._id });
            if (find_user) {
                next();
            }
        

       
    } catch (error) {
        console.log(error);
        return res.status(global.CONFIGS.responseCode.exception).json({
            success: false,
            message: error.message
        })
    }
    
};

module.exports = {
    apiValidateToken
}
