var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');


module.exports = {

    UserSingup:  async (req, res, next) => {
        console.log(req.body);
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        console.log(find_user)
        if (find_user) {
            const err = new customError(global.CONFIGS.api.registerFail, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
    
        var createuser = await UserModel.create({
            "Otp": common.randomNumber(),
            "OtpsendDate": new Date(),
            "userType": req.body.userType,
            "mobile": req.body.mobile,
        });
        if (createuser ) {
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.registerSuccess,
                data: {
                    "UserId": createuser._id,
                    "Otp": createuser.Otp,
                    "userType": createuser.userType,
                    "activeStatus": createuser.activeStatus,
                },
            })
        } 
    },

    VerifieUser: async (req, res, next) => {
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        if (req.body.verifyOtp === false || req.body.verifyOtp === undefined) {
            const err = new customError(global.CONFIGS.api.verifyOtpFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        if (req.body.verifyOtp === true) {
            var update_user = await UserModel.updateOne({ _id: find_user._id }, { isVerified: req.body.verifyOtp });
            const payload = { mobile: find_user.mobile, _id: find_user._id };
            const options = {
                expiresIn: global.CONFIGS.token.apiTokenExpiry,
                issuer: "Dudhu",
            };
            const secret = process.env.SECRETKEY;
            const token = await jwt.sign(payload, secret, options);

            console.log(token)
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.verifyOtp,
                data: {
                    "UserId": find_user._id,
                    "userType": find_user.userType,
                    "activeStatus": find_user.activeStatus,
                    "token": token
                },
            })
        }

    },

    reSendOtp: async (req, res, next) => {
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);

        }
        var otp = common.randomNumber();
        var update_user = await UserModel.updateOne({ _id: find_user._id }, {
            Otp: otp,
            OtpsendDate: new Date(),
        });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.sendOtpSuccess,
            data: {
                "Otp": otp
            },
        })
    },

    login: async (req, res, next) => {

        var find_user = await UserModel.findOne({ mobile: req.body.mobile ,userType: req.body.userType });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
            
        if (find_user.isVerified === false) {
            const err = new customError(global.CONFIGS.api.phoneNotVerify, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        const match = await bcrypt.compare(req.body.password, find_user.password);
        if (!match) {
            const err = new customError(global.CONFIGS.api.loginFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        const payload = { mobile: find_user.mobile, _id: find_user._id };
        const options = {
            expiresIn: global.CONFIGS.token.apiTokenExpiry,
            issuer: "Dudhu",
        };
        const secret = process.env.SECRETKEY;
        const token = await jwt.sign(payload, secret, options);

        console.log(token)
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.loginSuccess,
            data: {
                "UserId": find_user._id,
                "name": find_user.name,
                "email": find_user.email,
                "mobile": find_user.mobile,
                "userType": find_user.userType,
                "activeStatus": find_user.activeStatus,
                "token": token
            },
        })
    },

    

    forgetPass: async (req, res, next) => {
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        var otp = common.randomNumber();
        var update_user = await UserModel.updateOne({ _id: find_user._id }, {
            Otp: otp,
            OtpsendDate: new Date(),
        });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.sendOtpSuccess,
            data: {
                "Otp": otp
            },
        })
    },

    resetPass: async (req, res, next) => {
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        
        if (req.body.verifyOtp === false || req.body.verifyOtp === undefined) {
            const err = new customError(global.CONFIGS.api.verifyOtpFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        if (req.body.password !== req.body.confPass) {
            const err = new customError(global.CONFIGS.api.matchPasswordFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
            
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        var update_user = await UserModel.updateOne({ _id: find_user._id }, { password: hash });
            
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    changePass: async (req, res, next) => {
        var find_user = await UserModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        const match = await bcrypt.compare(req.body.oldPassword, find_user.password);
        if (!match) {
             const err = new customError(global.CONFIGS.api.matchPasswordFail, global.CONFIGS.responseCode.Unauthorized);
            next(err);
        }
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.newPassword, salt);
        var update_user = await UserModel.updateOne({ _id: find_user._id }, { password: hash });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    updateUserProfile: async (req, res, next) => {
        console.log(req.body);
        
        var find_user = await UserModel.findOne({ _id: req.body.UserId });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.password, salt);

        var createuser = await UserModel.updateOne({_id:find_user._id},{
            "name": req.body.name,
            "email": req.body.email,
            "password": hash,
        });
        if (createuser) {
            var find_user2 = await UserModel.findOne({ _id: req.body.UserId });
            const payload = { mobile: find_user2.mobile, _id: find_user2._id };
            const options = {
                expiresIn: global.CONFIGS.token.apiTokenExpiry,
                issuer: "Dudhu",
            };
            const secret = process.env.SECRETKEY;
            const token = await jwt.sign(payload, secret, options);

            console.log(token)
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.registerSuccess,
                data: {
                    "UserId": find_user2._id,
                    "Otp": find_user2.Otp,
                    "name": find_user2.name,
                    "email": find_user2.email,
                    "mobile": find_user2.mobile,
                    "password": find_user2.password,
                    "userType": find_user2.userType,
                    "activeStatus": find_user2.activeStatus,
                    "token": token
                },
            })
        }
    },

    deleteUser: async (req, res, next) => {
        console.log(req.body);

        var find_user = await UserModel.findOne({ _id: req.params.id });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }

        var delete_user = await UserModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.userDelete,
        })

    },

    getUserProfile: async (req, res, next) => {
        console.log(req.body);
        
        var find_user = await UserModel.findOne({ _id: req.query.UserId });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        
        var find_user2 = await UserModel.findOne({ _id: req.query.UserId });
        const payload = { mobile: find_user2.mobile, _id: find_user2._id };
        const options = {
            expiresIn: global.CONFIGS.token.apiTokenExpiry,
            issuer: "Dudhu",
        };
        const secret = process.env.SECRETKEY;
        const token = await jwt.sign(payload, secret, options);

        console.log(token)
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.registerSuccess,
            data: {
                "UserId": find_user2._id,
                "name": find_user2.name,
                "email": find_user2.email || '',
                "mobile": find_user2.mobile,
                "userType": find_user2.userType,
                "activeStatus": find_user2.activeStatus,
                "token": token
            },
        })
        
    },

    getUserAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;

        var find_user = await UserModel.aggregate([
            {
                $match: { $or: [{ activeStatus:"1"   }] }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        // return res.send(find_user)
        if (find_user[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getUserDetailsSuccess,
            totalPage: totalPage,
            data: find_user[0].data
        })

    },

}
