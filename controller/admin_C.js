var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");

module.exports = {
  adminSingup: async (req, res, next) => {
    // console.log(req.body);
    var find_user = await UserModel.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });
    if (find_user) {
      const err = new customError(
        global.CONFIGS.api.registerFail,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    var createuser = await UserModel.create({
      Otp: common.randomNumber(),
      OtpsendDate: new Date(),
      isVerified: true,
      mobile: req.body.mobile,
      email: req.body.email,
      userType: "Admin",
      password: hash,
    });
    if (createuser) {
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.registerSuccess,
        data: {
          UserId: createuser._id,
          Otp: createuser.Otp,
          userType: createuser.userType,
          activeStatus: createuser.activeStatus,
        },
      });
    }
  },

  login: async (req, res, next) => {
    // var find_user1 = await UserModel.findOne({ email: req.body.email, userType: "Admin" });
    // if (find_user1) {
    //     return res.status(global.CONFIGS.responseCode.notFound).json({
    //         success: false,
    //         message: global.CONFIGS.api.userNotFound,
    //     })
    // }
    var find_user = await UserModel.findOne({ email: req.body.email });
    // console.log(find_user);
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    if (find_user.isVerified === false) {
      const err = new customError(
        global.CONFIGS.api.phoneNotVerify,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const match = await bcrypt.compare(req.body.password, find_user.password);
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.loginFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const payload = {
      email: find_user.email,
      _id: find_user._id,
      userType: find_user.userType,
    };
    const options = {
      expiresIn: global.CONFIGS.token.apiTokenExpiry,
      issuer: "Dudhu",
    };
    const secret = process.env.SECRETKEY;
    const token = await jwt.sign(payload, secret, options);
    // console.log(token);
    res.cookie("adminToken", token, {
      path: "/",
      maxAge: 2592000000,
      httpOnly: true,
      SameSite: "none",
      secure: true,
    });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.loginSuccess,
      data: {
        UserId: find_user._id,
        name: find_user.name,
        email: find_user.email,
        mobile: find_user.mobile,
        userType: find_user.userType,
        activeStatus: find_user.activeStatus,
        token: token,
      },
    });
  },
};
