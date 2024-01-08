var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var constants = require("../models/modelConstants");
var UserModel = mongoose.model(constants.UserModel);
var customError = require('./customerror');

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

const apiValidateToken = errorfun( async function (req, res, next) {
    var accessToken = req.headers['access-token'];
    var decode = await jwt.verify(accessToken, process.env.SECRETKEY);
        
    var find_user = await UserModel.findOne({ _id: decode._id });
    if (!find_user) {
        const err = new customError(global.CONFIGS.api.tokenError, global.CONFIGS.responseCode.Unauthorized);
        next(err);
    }
    if (find_user) {
        next();
    }
});

module.exports = {
    apiValidateToken
}
