var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeModel = mongoose.model(constants.BikeModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const bcrypt = require("bcrypt");
const DriverDocModel = mongoose.model(constants.DriverDocModel);
const DriverAddressModel = mongoose.model(constants.DriverAddressModel);
const DriverBankDetailsModel = mongoose.model(constants.DriverBankDetailsModel);

module.exports = {
  addVehicle: async (req, res, next) => {
    console.log(req.files);
    var mulkiyaDocImg = {};
    var vehicleImage = {};
    if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
      mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;
      // return res.send(req.body)
    }
    if (
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight
    ) {
      vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;
      // return res.send(req.body);
    }

    var find_Driver = await BikeDriverModel.findOne({
      $or: [
        { mobile: req.body.mobile },
        { licenseNumber: req.body.licenseNumber },
        { visaNumber: req.body.visaNumber },
        { emiratesId: req.body.emiratesId },
      ],
    });
    var find_vehicle = await BikeModel.findOne({
      chasisNumber: req.body.chasisNumber,
    });
    if (find_vehicle || find_Driver) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_vehicle = await BikeModel.create(req.body);
    /**vaildation for image and password when  driver is created*/
    var passportImg = {};
    var emiratesIdImg = {};
    var licenseImg = {};
    if (req.files.passportImgFront && req.files.passportImgBack) {
      passportImg.frontImg = `uploads/driver/${req.files.passportImgFront[0].filename}`;
      passportImg.backImg = `uploads/driver/${req.files.passportImgBack[0].filename}`;
      req.body.passportImg = passportImg;
    }
    if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
      emiratesIdImg.frontImg = `uploads/driver/${req.files.emiratesIdImgFront[0].filename}`;
      emiratesIdImg.backImg = `uploads/driver/${req.files.emiratesIdImgBack[0].filename}`;
      req.body.emiratesIdImg = emiratesIdImg;
    }
    if (req.files.licenseImgFront && req.files.licenseImgBack) {
      licenseImg.frontImg = `uploads/driver/${req.files.licenseImgFront[0].filename}`;
      licenseImg.backImg = `uploads/driver/${req.files.licenseImgBack[0].filename}`;
      req.body.licenseImg = licenseImg;
    }
    if (req.files.visaImg) {
      req.body.visaImg = `uploads/driver/${req.files.visaImg[0].filename}`;
    }
    if (req.files.driverImg) {
      req.body.driverImg = `uploads/driver/${req.files.driverImg[0].filename}`;
    }

    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    var create_driver = await BikeDriverModel.create(req.body);
    if (create_driver) {
      req.body.driverId = create_driver._id;
      var create_doc = await DriverDocModel.create(req.body);
      var create_bankDetails = await DriverBankDetailsModel.create(req.body);
      var localAddress = {
        houseNo: req.body.lHouseNo,
        buildingName: req.body.lBuildingName,
        street: req.body.lStreet,
        landmark: req.body.lLandmark,
      };
      var homeCountryAddress = {
        houseNo: req.body.hcHouseNo,
        buildingName: req.body.hcBuildingName,
        street: req.body.hcStreet,
        landmark: req.body.hcLandmark,
        city: req.body.hcCity,
        state: req.body.hcState,
        pinCode: req.body.hcPinCode,
      };
      var emergencyContact = {
        namr: req.body.ecName,
        relation: req.body.ecRelation,
        mobile: req.body.ecMobile,
      };
      var create_address = await DriverAddressModel.create({
        emergencyContact: emergencyContact,
        homeCountryAddress: homeCountryAddress,
        localAddress: localAddress,
        driverId: create_driver._id,
      });
      if (create_address && create_bankDetails && create_doc) {
        var update_driver = await BikeDriverModel.updateOne(
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
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Productadded,
      data: create_vehicle,
      create_driver,
    });
  },

  updateVehicle: async (req, res, next) => {
    var mulkiyaDocImg = {};
    var vehicleImage = {};
    if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
      mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;
      return res.send(req.body);
    }
    if (
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight
    ) {
      vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;
      return res.send(req.body);
    }
    var find_vehicle = await BikeModel.findOne({
      chasisNumber: req.body.chasisNumber,
      _id: { $nin: [req.params.id] },
    });
    if (find_vehicle) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var update_vehicle = await BikeModel.updateOne(
      { _id: req.params.id },
      req.body
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.ProductUpdated,
    });
  },

  deletevehicle: async (req, res, next) => {
    var delete_vehicle = await BikeModel.deleteOne({ _id: req.params.id });
    if (delete_vehicle) {
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.ProductDelete,
      });
    }
  },

  vehicleListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var bikeData = await BikeModel.aggregate([
      {
        $match: { activeStatus: "1" },
      },
      {
        $lookup: {
          from: "bikebrand",
          localField: "brandId",
          foreignField: "_id",
          as: "bikebrand",
        },
      },
      { $unwind: "$bikebrand" },
      { $unset: "brandId" },
      {
        $lookup: {
          from: "bikemodel",
          localField: "modelId",
          foreignField: "_id",
          as: "bikemodel",
        },
      },
      { $unwind: "$bikemodel" },
      { $unset: "modelId" },
      {
        $project: {
          _id: "$_id",
          ownerName: "$ownerName",
          vehicleNumber: "$vehicleNumber",
          registrationZone: "$registrationZone",
          registrationDate: "$registrationDate",
          vehicleColor: "$vehicleColor",
          vehicleYear: "$vehicleYear",
          vehicleAge: "$vehicleAge",
          chasisNumber: "$chasisNumber",
          insuranceValidity: "$insuranceValidity",
          fitnessValidity: "$fitnessValidity",
          mulkiyaValidity: "$mulkiyaValidity",
          mulkiyaDocImg: "$mulkiyaDocImg",
          vehicleImage: "$vehicleImage",
          activeStatus: "$activeStatus",
          bikeBrand: "$bikebrand.bikeBrand",
          bikemodel: "$bikemodel.bikeModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (bikeData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFoud
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(bikeData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalPage: totalPage,
      allOrder: bikeData[0].data,
    });
  },

  vehicleListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    var bikeData = await BikeModel.aggregate([
      {
        $lookup: {
          from: "bikebrand",
          localField: "brandId",
          foreignField: "_id",
          as: "bikebrand",
        },
      },
      { $unwind: "$bikebrand" },
      { $unset: "brandId" },
      {
        $lookup: {
          from: "bikemodel",
          localField: "modelId",
          foreignField: "_id",
          as: "bikemodel",
        },
      },
      { $unwind: "$bikemodel" },
      { $unset: "modelId" },
      {
        $project: {
          _id: "$_id",
          ownerName: "$ownerName",
          vehicleNumber: "$vehicleNumber",
          registrationZone: "$registrationZone",
          registrationDate: "$registrationDate",
          vehicleColor: "$vehicleColor",
          vehicleYear: "$vehicleYear",
          vehicleAge: "$vehicleAge",
          chasisNumber: "$chasisNumber",
          insuranceValidity: "$insuranceValidity",
          fitnessValidity: "$fitnessValidity",
          mulkiyaValidity: "$mulkiyaValidity",
          mulkiyaDocImg: "$mulkiyaDocImg",
          vehicleImage: "$vehicleImage",
          activeStatus: "$activeStatus",
          bikeBrand: "$bikebrand.bikeBrand",
          bikemodel: "$bikemodel.bikeModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (bikeData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFoud
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(bikeData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalPage: totalPage,
      allOrder: bikeData[0].data,
    });
  },
};
