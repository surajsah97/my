var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
            const hash = await bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            

            var createuser = await UserModel.create(req.body);
            if (createuser) {
                const payload = { mobile: createuser.mobile, _id: createuser._id };
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
                        "_id": createuser._id,
                        "name": createuser.name,
                        "email": createuser.email,
                        "mobile": createuser.mobile,
                        "password": createuser.password,
                        "userType": createuser.userType,
                        "activeStatus": createuser.activeStatus,
                        "token":token 
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
            var find_user = await UserModel.findOne({ email: req.body.email });
            if (!find_user) {
                return res.status(global.CONFIGS.responseCode.notFoud).json({
                    success: false,
                    message: global.CONFIGS.api.userNotFound,
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
                    "_id": find_user._id,
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
    }
}
