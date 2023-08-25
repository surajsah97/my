var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");

module.exports = {
    UserSingup: async (req, res, next) => {
        console.log(req.body);
        try {
            var find_user = await UserModel.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
            if (find_user) {
                return res.status(global.CONFIGS.responseCode.alreadyExist).json({
                    success: false,
                    message: global.CONFIGS.api.registerFail,
                })
            }
            // const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
            // const hash = await bcrypt.hashSync(req.body.password, salt);
    
            var createuser = await UserModel.create({
                "Otp": common.randomNumber(),
                "OtpsendDate": new Date(),
                "userType": req.body.userType,
                // "name": req.body.name,
                // "email": req.body.email,
                "mobile": req.body.mobile,
                // "password": hash,
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
            
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    login: async (req, res) => {
        try {
            var find_user1 = await UserModel.findOne({ mobile: req.body.mobile, userType:"1" });
            if (find_user1) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            
            if (find_user.isVerified===false) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.phoneNotVerify,
                })
            }
            const match = await bcrypt.compare(req.body.password, find_user.password);
            if (!match) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.loginFail,
                })
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
                    "password": find_user.password,
                    "userType": find_user.userType,
                    "activeStatus": find_user.activeStatus,
                    "token": token
                },
            })

        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    VerifieUser: async (req, res) => {
        try {
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            if (find_user.Otp != req.body.Otp) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.verifyOtpFail,
                })
            }
            var timediff = common.datediff(find_user.OtpsendDate);
            console.log("timediff= ",timediff);
            if (timediff > global.CONFIGS.OtpTimeLimit.limit) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.verifyOtpexp,
                })
            }
            if (find_user.userType == global.CONFIGS.role.user) {
                var update_user = await UserModel.updateOne({ _id: find_user._id }, { isVerified: true });
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

            } else {
                var update_user = await UserModel.updateOne({ _id: find_user._id }, { isVerified: true });
                return res.status(global.CONFIGS.responseCode.success).json({
                    success: true,
                    message: global.CONFIGS.api.verifyOtp,
                    data: {
                        "UserId": find_user._id,
                        "userType": find_user.userType,
                        "activeStatus": find_user.activeStatus,
                    },
                })
            }
            
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    reSendOtp: async (req, res) => {
        try {
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
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


        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            }) 
        }
    },

    forgetPass: async (req, res) => {
        try {
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
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
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            }) 
        }
    },
    resetPass: async (req, res) => {
        try {
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            if (find_user.Otp != req.body.Otp) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.verifyOtpFail,
                })
            }
            var timediff = common.datediff(find_user.OtpsendDate);
            console.log("timediff= ", timediff);
            if (timediff > global.CONFIGS.OtpTimeLimit.limit) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.verifyOtpexp,
                })
            }
            
            const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
            const hash = await bcrypt.hashSync(req.body.password, salt);
            var update_user = await UserModel.updateOne({ _id: find_user._id }, { password: hash });
            
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.changePasswordSuccess,
            })

        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    changePass: async (req, res) => {
        try {
            var find_user = await UserModel.findOne({ mobile: req.body.mobile });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            const match = await bcrypt.compare(req.body.oldPassword, find_user.password);
            if (!match) {
                return res.status(global.CONFIGS.responseCode.Unauthorized).json({
                    success: false,
                    message: global.CONFIGS.api.matchPasswordFail,
                })
            }
            const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
            const hash = await bcrypt.hashSync(req.body.newPassword, salt);
            var update_user = await UserModel.updateOne({ _id: find_user._id }, { password: hash });

            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.changePasswordSuccess,
            })
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

    updateUserProfile: async (req, res, next) => {
        console.log(req.body);
        try {
            var find_user1 = await UserModel.findOne({ _id: req.body.UserId, userType: "1" });
            if (find_user1) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
            }
            var find_user = await UserModel.findOne({ _id: req.body.UserId });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
                })
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


        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    },

}
