var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);
const TempUserModel = mongoose.model(constants.TempUserModel);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
var moment = require('moment');

module.exports = {
  UserSingup: async (req, res, next) => {
    console.log(req.body);
    var find_user = await UserModel.findOne({ mobile: req.body.mobile });
    console.log(find_user);
    if (find_user) {
      const err = new customError(
        global.CONFIGS.api.registerFail,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    var createuser = await TempUserModel.create({
      Otp: common.randomNumber(),
      OtpsendDate: new Date(),
      userType: req.body.userType,
      mobile: req.body.mobile,
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

  VerifieUser: async (req, res, next) => {
    var find_user = await TempUserModel.findOne({
      mobile: req.body.mobile,
    }).sort({ _id: -1 });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (req.body.verifyOtp === false || req.body.verifyOtp === undefined) {
      const err = new customError(
        global.CONFIGS.api.verifyOtpFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    if (req.body.verifyOtp === true) {
      var update_user = await UserModel.create({
        Otp: common.randomNumber(),
        OtpsendDate: new Date(),
        userType: find_user.userType,
        mobile: find_user.mobile,
        isVerified: req.body.verifyOtp,
      });
      const payload = { mobile: update_user.mobile, _id: update_user._id };
      const options = {
        expiresIn: global.CONFIGS.token.apiTokenExpiry,
        issuer: "Dudhu",
      };
      const secret = process.env.SECRETKEY;
      const token = await jwt.sign(payload, secret, options);

      console.log(token);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.verifyOtp,
        data: {
          UserId: update_user._id,
          userType: update_user.userType,
          activeStatus: update_user.activeStatus,
          token: token,
        },
      });
    }
  },

  reSendOtp: async (req, res, next) => {
    var find_user = await UserModel.findOne({ mobile: req.body.mobile });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_user = await UserModel.updateOne(
      { _id: find_user._id },
      {
        Otp: otp,
        OtpsendDate: new Date(),
      }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.sendOtpSuccess,
      data: {
        Otp: otp,
      },
    });
  },

  login: async (req, res, next) => {
    var find_user = await UserModel.findOne({
      mobile: req.body.mobile,
      userType: req.body.userType,
    });
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
    const payload = { mobile: find_user.mobile, _id: find_user._id };
    const options = {
      expiresIn: global.CONFIGS.token.apiTokenExpiry,
      issuer: "Dudhu",
    };
    const secret = process.env.SECRETKEY;
    const token = await jwt.sign(payload, secret, options);

    console.log(token);
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

  forgetPass: async (req, res, next) => {
    var find_user = await UserModel.findOne({ mobile: req.body.mobile });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_user = await UserModel.updateOne(
      { _id: find_user._id },
      {
        Otp: otp,
        OtpsendDate: new Date(),
      }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.sendOtpSuccess,
      data: {
        Otp: otp,
      },
    });
  },

  resetPass: async (req, res, next) => {
    var find_user = await UserModel.findOne({ mobile: req.body.mobile });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    if (req.body.verifyOtp === false || req.body.verifyOtp === undefined) {
      const err = new customError(
        global.CONFIGS.api.verifyOtpFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    if (req.body.password !== req.body.confPass) {
      const err = new customError(
        global.CONFIGS.api.matchPasswordFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }

    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    var update_user = await UserModel.updateOne(
      { _id: find_user._id },
      { password: hash }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
    });
  },

  changePass: async (req, res, next) => {
    var find_user = await UserModel.findOne({ mobile: req.body.mobile });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const match = await bcrypt.compare(
      req.body.oldPassword,
      find_user.password
    );
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.matchPasswordFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      next(err);
    }
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.newPassword, salt);
    var update_user = await UserModel.updateOne(
      { _id: find_user._id },
      { password: hash }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
    });
  },

  updateUserProfile: async (req, res, next) => {
    // console.log(req.body,"....body");
    // console.log( req.files,"....file");
      if (req.files != undefined) {
          if (req.files.userImage != undefined) {
              req.body.userImage = `uploads/user/${req.files.userImage[0].filename}`;
          }
    }
    var find_user = await UserModel.findOne({ _id: req.body.UserId });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (req.body.password != undefined) {
      const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
      const hash = await bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
    }
    var createuser = await UserModel.updateOne(
      { _id: find_user._id },
      req.body
    );
    if (createuser) {
      var find_user2 = await UserModel.findOne({ _id: req.body.UserId });
      const payload = { mobile: find_user2.mobile, _id: find_user2._id };
      const options = {
        expiresIn: global.CONFIGS.token.apiTokenExpiry,
        issuer: "Dudhu",
      };
      const secret = process.env.SECRETKEY;
      const token = await jwt.sign(payload, secret, options);

      // console.log(token);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.userUpdateSuccess,
        data: {
          UserId: find_user2._id,
          mobile: find_user2.mobile,
          Otp: find_user2.Otp,
          isVerified: find_user2.isVerified,
          userType: find_user2.userType,
          activeStatus: find_user2.activeStatus,
          trialActive: find_user2.trialActive,
          trialQuantity: find_user2.trialQuantity,
          name: find_user2.name,
          email: find_user2.email,
          password: find_user2.password,
          DOB: find_user2.DOB,
          userImage: find_user2.userImage,
          token: token,
        },
      });
    }
  },

  deleteUser: async (req, res, next) => {
    console.log(req.body);

    var find_user = await UserModel.findOne({ _id: req.params.id });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    var delete_user = await UserModel.deleteOne({ _id: req.params.id });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.userDelete,
    });
  },

  getUserProfile: async (req, res, next) => {
    console.log(req.query);

    var find_user = await UserModel.findOne({ _id: req.query.UserId });
    if (!find_user) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
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
    var dob = "";
  if(find_user2.DOB!=undefined ||find_user2.DOB!=null ){
     dob = moment(find_user2.DOB).format("DD-MM-YYYY");
  }
    // console.log(token);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getUserProfileSuccess,
      data: {
        UserId: find_user2._id,
          mobile: find_user2.mobile,
          Otp: find_user2.Otp,
          isVerified: find_user2.isVerified,
          userType: find_user2.userType,
          activeStatus: find_user2.activeStatus,
          trialActive: find_user2.trialActive,
          trialQuantity: find_user2.trialQuantity,
          name: find_user2.name,
          email: find_user2.email,
          password: find_user2.password,
          DOB: dob,
          userImage: find_user2.userImage,
          token: token,
      },
    });
  },

  getUserAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var find_user = await UserModel.aggregate([
      {
        $match: { $or: [{ activeStatus: "1" }] },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    // return res.send(find_user)
    if (find_user[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getUserDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getUserDetailsSuccess,
      totalPage: totalPage,
      data: find_user[0].data,
    });
  },
};
