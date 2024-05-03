var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckDriverModel = mongoose.model(constants.TruckDriverModel);
const TruckDriverDocModel = mongoose.model(constants.TruckDriverDocModel);
const TruckDriverAddressModel = mongoose.model(
  constants.TruckDriverAddressModel
);
const TruckDriverBankDetailsModel = mongoose.model(
  constants.TruckDriverBankDetailsModel
);
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
const customError = require("../middleware/customerror");
const validationSchema = require("../validation/truckDriverValidation");

module.exports = {
  addTruckDriver: async (req, res, next) => {
    const find_Driver = await TruckDriverModel.findOne({
      $or: [
        { mobile: req.body.mobile },
        { licenseNumber: req.body.licenseNumber },
        { visaNumber: req.body.visaNumber },
        { emiratesId: req.body.emiratesId },
      ],
    });
    // console.log(find_Driver);
    if (find_Driver) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      const err = new customError(
        validationResult.error.message,
        global.CONFIGS.responseCode.validationError
      );
      return next(err);
    }

    const fileFields = [
      "passportImgFront",
      "passportImgBack",
      "emiratesIdImgFront",
      "emiratesIdImgBack",
      "licenseImgFront",
      "licenseImgBack",
      "visaImg",
      "driverImg",
    ];
    for (const field of fileFields) {
      if (!req.files[field]) {
        const err = new customError(
          `File upload for field '${field}' is missing.`,
          global.CONFIGS.responseCode.validationError
        );
        return next(err);
      }
    }
    // console.log(req.files)
    const passportImg = {};
    const emiratesIdImg = {};
    const licenseImg = {};
    if (req.files.passportImgFront && req.files.passportImgBack) {
      passportImg.frontImg = `uploads/truckdriver/${req.files.passportImgFront[0].filename}`;
      passportImg.backImg = `uploads/truckdriver/${req.files.passportImgBack[0].filename}`;
      req.body.passportImg = passportImg;
    }
    if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
      emiratesIdImg.frontImg = `uploads/truckdriver/${req.files.emiratesIdImgFront[0].filename}`;
      emiratesIdImg.backImg = `uploads/truckdriver/${req.files.emiratesIdImgBack[0].filename}`;
      req.body.emiratesIdImg = emiratesIdImg;
    }
    if (req.files.licenseImgFront && req.files.licenseImgBack) {
      licenseImg.frontImg = `uploads/truckdriver/${req.files.licenseImgFront[0].filename}`;
      licenseImg.backImg = `uploads/truckdriver/${req.files.licenseImgBack[0].filename}`;
      req.body.licenseImg = licenseImg;
    }
    if (req.files.visaImg) {
      req.body.visaImg = `uploads/truckdriver/${req.files.visaImg[0].filename}`;
    }
    if (req.files.driverImg) {
      req.body.driverImg = `uploads/truckdriver/${req.files.driverImg[0].filename}`;
    }
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    let truckDRiverDetails = {};
    truckDRiverDetails.name = req.body.name;
    truckDRiverDetails.email = req.body.email;
    truckDRiverDetails.password = req.body.password;
    truckDRiverDetails.mobile = req.body.mobile;
    truckDRiverDetails.altMobile = req.body.altMobile;
    truckDRiverDetails.nationality = req.body.nationality;
    truckDRiverDetails.passportNumber = req.body.passportNumber;
    truckDRiverDetails.passportValidity = req.body.passportValidity;
    truckDRiverDetails.visaNumber = req.body.visaNumber;
    truckDRiverDetails.visaValidity = req.body.visaValidity;
    truckDRiverDetails.emiratesId = req.body.emiratesId;
    truckDRiverDetails.emiratesIdValidity = req.body.emiratesIdValidity;
    truckDRiverDetails.InsuranceComp = req.body.InsuranceComp;
    truckDRiverDetails.insuranceValidity = req.body.insuranceValidity;
    truckDRiverDetails.licenseNumber = req.body.licenseNumber;

    truckDRiverDetails.licenseCity = req.body.licenseCity;
    truckDRiverDetails.licenseType = req.body.licenseType;
    truckDRiverDetails.licenseValidity = req.body.licenseValidity;
    truckDRiverDetails.addressId = req.body.addressId;
    truckDRiverDetails.bankDetailsId = req.body.bankDetailsId;
    truckDRiverDetails.docId = req.body.docId;
    truckDRiverDetails.isVerified = req.body.isVerified;
    truckDRiverDetails.driverType = req.body.driverType;
    truckDRiverDetails.activeStatus = req.body.activeStatus;
    const create_driver = await TruckDriverModel.create(truckDRiverDetails);
    if (create_driver) {
      req.body.driverId = create_driver._id;
      let driverDoc = {};
      driverDoc.passportImg = passportImg;
      driverDoc.emiratesIdImg = emiratesIdImg;
      driverDoc.licenseImg = licenseImg;
      driverDoc.driverImg = req.body.driverImg;
      driverDoc.visaImg = req.body.visaImg;
      driverDoc.driverId = req.body.driverId;
      driverDoc.activeStatus = req.body.activeStatus;

      const create_doc = await TruckDriverDocModel.create(driverDoc);
      const create_bankDetails = await TruckDriverBankDetailsModel.create(
        req.body
      );

      const localAddress = {
        houseNo: req.body.lHouseNo,
        buildingName: req.body.lBuildingName,
        street: req.body.lStreet,
        landmark: req.body.lLandmark,
      };
      const homeCountryAddress = {
        houseNo: req.body.hcHouseNo,
        buildingName: req.body.hcBuildingName,
        street: req.body.hcStreet,
        landmark: req.body.hcLandmark,
        city: req.body.hcCity,
        state: req.body.hcState,
        pinCode: req.body.hcPinCode,
      };
      const emergencyContact = {
        name: req.body.ecName,
        relation: req.body.ecRelation,
        mobile: req.body.ecMobile,
      };
      const create_address = await TruckDriverAddressModel.create({
        emergencyContact: emergencyContact,
        homeCountryAddress: homeCountryAddress,
        localAddress: localAddress,
        driverId: create_driver._id,
      });
      if (create_address && create_bankDetails && create_doc) {
        var update_driver = await TruckDriverModel.updateOne(
          { _id: create_driver._id },
          {
            addressId: create_address._id,
            bankDetailsId: create_bankDetails._id,
            docId: create_doc._id,
          }
        );
        return res.status(global.CONFIGS.responseCode.success).json({
          success: true,
          message: global.CONFIGS.api.Productadded,
          // data: create_vehicle
        });
      }
    }
  },

  updateTruckDriver: async (req, res, next) => {
    let find_Driver = await TruckDriverModel.findById(req.params.id);
    if (!find_Driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const existing_Driver = await TruckDriverModel.findOne({
      $or: [
        { mobile: req.body.mobile },
        { licenseNumber: req.body.licenseNumber },
        { visaNumber: req.body.visaNumber },
        { emiratesId: req.body.emiratesId },
      ],
      _id: { $nin: [req.params.id] },
    });
    if (existing_Driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriveralreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      next(err);
    }

    const passportImg = {};
    const emiratesIdImg = {};
    const licenseImg = {};
    if (req.files.passportImgFront && req.files.passportImgBack) {
      passportImg.frontImg = `uploads/truckdriver/${req.files.passportImgFront[0].filename}`;
      passportImg.backImg = `uploads/truckdriver/${req.files.passportImgBack[0].filename}`;
      req.body.passportImg = passportImg;
    }
    if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
      emiratesIdImg.frontImg = `uploads/truckdriver/${req.files.emiratesIdImgFront[0].filename}`;
      emiratesIdImg.backImg = `uploads/truckdriver/${req.files.emiratesIdImgBack[0].filename}`;
      req.body.emiratesIdImg = emiratesIdImg;
    }
    if (req.files.licenseImgFront && req.files.licenseImgBack) {
      licenseImg.frontImg = `uploads/truckdriver/${req.files.licenseImgFront[0].filename}`;
      licenseImg.backImg = `uploads/truckdriver/${req.files.licenseImgBack[0].filename}`;
      req.body.licenseImg = licenseImg;
    }
    if (req.files.visaImg) {
      req.body.visaImg = `uploads/truckdriver/${req.files.visaImg[0].filename}`;
    }
    if (req.files.driverImg) {
      req.body.driverImg = `uploads/truckdriver/${req.files.driverImg[0].filename}`;
    }
    if(req.body.password) {
      const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    }

    find_Driver = await TruckDriverModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.truckDriverUpdated,
      data: find_Driver,
    });
  },

  loginTruckDriver: async (req, res, next) => {
    var find_driver = await TruckDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const match = await bcrypt.compare(req.body.password, find_driver.password);
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.loginFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const payload = { mobile: find_driver.mobile, _id: find_driver._id };
    const options = {
      expiresIn: global.CONFIGS.token.apiTokenExpiry,
      issuer: "Dudhu",
    };
    const secret = process.env.SECRETKEY;
    const token = await jwt.sign(payload, secret, options);
    // console.log(token);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.truckdriverloginSuccess,
      data: {
        driverId: find_driver._id,
        name: find_driver.name,
        email: find_driver.email,
        mobile: find_driver.mobile,
        driverType: find_driver.driverType,
        activeStatus: find_driver.activeStatus,
        token: token,
      },
    });
  },

  reSendOtp: async (req, res, next) => {
    var find_driver = await TruckDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_driver = await TruckDriverModel.updateOne(
      { _id: find_driver._id },
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

  forgetPass: async (req, res, next) => {
    var find_driver = await TruckDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_driver = await TruckDriverModel.updateOne(
      { _id: find_driver._id },
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
    var find_driver = await TruckDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
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

    if (req.body.verifyOtp != undefined) {
      let validVerifyOtp = [true, false];
      if (!validVerifyOtp.includes(req.body.verifyOtp)) {
        const err = new customError(
          "invalid verifyOtp Allowed values are:true OR false",
          global.CONFIGS.responseCode.invalidInput
        );
        return next(err);
      }
    }

    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    var update_driver = await TruckDriverModel.findByIdAndUpdate(
      { _id: find_driver._id },
      { password: hash },
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
      data: update_driver,
    });
  },

  changePass: async (req, res, next) => {
    var find_driver = await TruckDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.truckDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const match = await bcrypt.compare(
      req.body.oldPassword,
      find_driver.password
    );
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.matchPasswordFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.newPassword, salt);
    var update_driver = await TruckDriverModel.findByIdAndUpdate(
      { _id: find_driver._id },
      { password: hash },
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
      data: update_driver,
    });
  },

  getTruckDriverProfile: async (req, res, next) => {
    var find_driver = await TruckDriverModel.aggregate([
      {
        $match: { activeStatus: "1", _id: new ObjectId(req.query.driverId) },
      },
      {
        $lookup: {
          from: "truckdriverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "truckdriverbankdetails",
        },
      },
      { $unwind: "$truckdriverbankdetails" },
      { $unset: "bankDetailsId" },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "truckdriveraddress",
        },
      },
      { $unwind: "$truckdriveraddress" },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "truckdriverdoc",
        },
      },
      { $unwind: "$truckdriverdoc" },
      { $unset: "docId" },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    if (find_driver.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getTruckDriverDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getTruckDriverDetailsSuccess,
      data: find_driver,
    });
  },
  getTruckDriverBYIDBYADMIN: async (req, res, next) => {
    var find_driver = await TruckDriverModel.aggregate([
      {
        $match: { _id: new ObjectId(req.query.driverId) },
      },
      {
        $lookup: {
          from: "truckdriverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "truckdriverbankdetails",
        },
      },
      { $unwind: "$truckdriverbankdetails" },
      { $unset: "bankDetailsId" },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "truckdriveraddress",
        },
      },
      { $unwind: "$truckdriveraddress" },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "truckdriverdoc",
        },
      },
      { $unwind: "$truckdriverdoc" },
      { $unset: "docId" },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    if (find_driver.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getTruckDriverDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getTruckDriverDetailsSuccess,
      data: find_driver,
    });
  },

  /**Working process */
  logoutTruckDriver: async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  },
  /** */

  getTruckDriverListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var find_driver = await TruckDriverModel.aggregate([
      {
        $match: { activeStatus: "1", driverType: "Truck" },
      },
      {
        $lookup: {
          from: "truckdriverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "truckdriverbankdetails",
        },
      },
      { $unwind: "$truckdriverbankdetails" },
      { $unset: "bankDetailsId" },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "truckdriveraddress",
        },
      },
      { $unwind: "$truckdriveraddress" },
      { $unset: "addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "truckdriverdoc",
        },
      },
      { $unwind: "$truckdriverdoc" },
      { $unset: "docId" },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    if (find_driver[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getTruckDriverDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(
      parseInt(find_driver[0].metadata[0].total) / limit
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.truckDriverListAdmin,
      totalPage: totalPage,
      data: find_driver[0].data,
    });
  },

  /**old */
  // truckDriverDeleted: async (req, res, next) => {
  //     var delete_doc = await TruckDriverAddressModel.deleteOne({ driverId: req.params.id });
  //     var delete_bank_details = await TruckDriverBankDetailsModel.deleteOne({ driverId: req.params.id });
  //     var delete_address = await TruckDriverDocModel.deleteOne({ driverId: req.params.id });
  //     var delete_driver = await TruckDriverModel.deleteOne({ _id: req.params.id });
  //     return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.categoryDelete,
  //     })
  // },
  /** */
  truckDriverDelete: async (req, res, next) => {
    const { id } = req.params;

    /* Delete BikeDriver*/
    const deletedDriver = await TruckDriverModel.findByIdAndRemove(id);

    if (!deletedDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    console.log(deletedDriver, "deletedriver.....,,,,");
    /* Delete Bank Details*/
    const deletedBankDetails =
      await TruckDriverBankDetailsModel.findByIdAndRemove(
        deletedDriver.bankDetailsId
      );

    if (!deletedBankDetails) {
      const err = new customError(
        global.CONFIGS.api.driverBankDetailsNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    /* Delete Driver Documents*/
    const deletedDriverDoc = await TruckDriverDocModel.findByIdAndRemove(
      deletedDriver.docId
    );
    if (!deletedDriverDoc) {
      const err = new customError(
        global.CONFIGS.api.DriverDocNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    /* Delete Driver Address*/
    const deletedDriverAddress =
      await TruckDriverAddressModel.findByIdAndRemove(deletedDriver.addressId);
    if (!deletedDriverAddress) {
      const err = new customError(
        global.CONFIGS.api.driverAddressNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.DriverDetailsDeleted,
    });
  },
};
