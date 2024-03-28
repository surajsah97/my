var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var constants = require("../models/modelConstants");
var UserModel = mongoose.model(constants.UserModel);
const TruckDriverModel = mongoose.model(constants.TruckDriverModel);
var customError = require('./customerror');
var axios = require("axios")

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

const apiValidateToken = errorfun(async function (req, res, next) {
    // console.log("req.headers = ",req.headers)
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
const validateTokenTruckDriver = errorfun(async function (req, res, next) {
    // console.log("req.headers = ",req.headers)
    var accessToken = req.headers['access-token'];
    var decode = await jwt.verify(accessToken, process.env.SECRETKEY);
        
    var find_TruckDriver = await TruckDriverModel.findOne({ _id: decode._id });
    if (!find_TruckDriver) {
        const err = new customError(global.CONFIGS.api.tokenError, global.CONFIGS.responseCode.Unauthorized);
        next(err);
    }
    if (find_TruckDriver) {
        next();
    }
});


const adminValidateToken = errorfun(async function (req, res, next) {
    console.log(req.cookies,"........cookies");
    var accessToken = req.cookies.adminToken;
    var decode = await jwt.verify(accessToken, process.env.SECRETKEY);

    var find_Admin = await UserModel.findOne({ _id: decode._id, userType:decode.userType });
    if (!find_Admin) {
        const err = new customError(global.CONFIGS.api.tokenError, global.CONFIGS.responseCode.Unauthorized);
        next(err);
    }
    if (find_Admin) {
        next();
    }
});

const reCAPTCHA = async (req, res, next) => {
    // console.log(req)
    const token = req.body.g_recaptcha_response || req.headers.g_recaptcha_response;
    const secret_key = process.env.SECRATKEY
    if (!token) {
        return res.status(401).json({ status: 401, message: 'Authentication failed: no recaptcha response provided.' });
    }
    try {
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`)
            .then(function (response) {

                if (response.data.success == true) {
                    next();
                } else {
                    return res.status(401).json({ status: 401, message: 'Authentication failed: timeout-or-duplicate.' });
                }
            })
            .catch(function (error) {
                console.log(error)
                return res.status(401).json({ status: 401, message: error });
            });


    } catch (error) {
        console.log(error)
        res.send("catch error");
    }
}

module.exports = {
    apiValidateToken,
    adminValidateToken, errorfun,
    reCAPTCHA,
    validateTokenTruckDriver
}
