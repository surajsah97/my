var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckModel = mongoose.model(constants.TruckModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");

module.exports = {  
  addTruck: async (req, res, next) => {
    const find_vehicle = await TruckModel.findOne({
      chasisNumber: req.body.chasisNumber,
    });
    if (find_vehicle) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    const mulkiyaDocImg = {};
    const vehicleImage = {};
    if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
      mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;
    }
    if (
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight
    ) {
      vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;
    }

    const truckDetails = {};
    truckDetails.truckBrandId = req.body.truckBrandId;
    truckDetails.truckModelId = req.body.truckModelId;
    truckDetails.ownerName = req.body.ownerName;
    truckDetails.vehicleNumber = req.body.vehicleNumber;
    truckDetails.registrationZone = req.body.registrationZone;
    truckDetails.vehicleColor = req.body.vehicleColor;
    truckDetails.registrationDate = req.body.registrationDate;
    truckDetails.vehicleYear = req.body.vehicleYear;
    truckDetails.fuelType = req.body.fuelType;
    truckDetails.vehicleAge = req.body.vehicleAge;
    truckDetails.chasisNumber = req.body.chasisNumber;
    truckDetails.insuranceValidity = req.body.insuranceValidity;
    truckDetails.fitnessValidity = req.body.fitnessValidity;
    truckDetails.mulkiyaValidity = req.body.mulkiyaValidity;
    truckDetails.mulkiyaDocImg = mulkiyaDocImg;
    truckDetails.vehicleImage = vehicleImage;
    truckDetails.activeStatus = req.body.activeStatus;

    const create_vehicle = await TruckModel.create(truckDetails);
    //   console.log(create_vehicle,"dgfdf = hvvhh =========")
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.Productadded,
      data: create_vehicle,
    });
  },

  updateVehicle: async (req, res, next) => {

    let find_vehicle = await TruckModel.findById(req.params.id);
        if (!find_vehicle) {
        const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
    const existing_vehicle = await TruckModel.findOne({
      $or:[

      {chasisNumber: req.body.chasisNumber},
      {vehicleNumber:req.body.vehicleNumber}
      ],
      _id: { $nin: [req.params.id] },
    });
    if (existing_vehicle) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      next(err);
    }

    const mulkiyaDocImg = {};
    const vehicleImage = {};
    if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
      mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;
    }
    if (
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight
    ) {
      vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;
    }
    
    find_vehicle = await TruckModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,{new:true}
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.ProductUpdated,
      data:find_vehicle
    });
  },

  deletevehicle: async (req, res, next) => {
    var delete_vehicle = await TruckModel.findByIdAndDelete({ _id: req.params.id });
    
    if(!delete_vehicle){
            const err = new customError(
          global.CONFIGS.api.ProductNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.ProductDelete,
        })
  },

  vehicleListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var truckData = await TruckModel.aggregate([
      {
        $match: { activeStatus: "1" },
      },
      {
        $lookup: {
          from: "truckbrand",
          localField: "truckBrandId",
          foreignField: "_id",
          as: "truckBrand",
        },
      },
      { $unwind: "$truckBrand" },
      { $unset: "truckBrandId" },
      {
        $lookup: {
          from: "truckmodel",
          localField: "truckModelId",
          foreignField: "_id",
          as: "truckModel",
        },
      },
      { $unwind: "$truckModel" },
      { $unset: "truckModelId" },
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
          fuelType: "$fuelType",
          activeStatus: "$activeStatus",
          truckBrand: "$truckBrand.truckBrand",
          truckModel: "$truckModel.truckModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (truckData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
     return next(err);
    }
    const total = parseInt(truckData[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(truckData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalData:total,
      totalPage: totalPage,
      allOrder: truckData[0].data,
    });
  },

  vehicleListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let truckData = await TruckModel.aggregate([
      {
        $lookup: {
          from: "truckbrand",
          localField: "truckBrandId",
          foreignField: "_id",
          as: "truckbrand",
        },
      },
      { $unwind: "$truckbrand" },
      { $unset: "truckBrandId" },
      {
        $lookup: {
          from: "truckmodel",
          localField: "truckModelId",
          foreignField: "_id",
          as: "truckmodel",
        },
      },
      { $unwind: "$truckmodel" },
      { $unset: "truckModelId" },
      {
        $project: {
          _id: "$_id",
          ownerName: "$ownerName",
          truckBrand: "$truckbrand.truckBrand",
          truckModel: "$truckmodel.truckModel",
          chasisNumber: "$chasisNumber",
          vehicleNumber: "$vehicleNumber",
          registrationZone: "$registrationZone",
          registrationDate: "$registrationDate",
          vehicleColor: "$vehicleColor",
          vehicleYear: "$vehicleYear",
          vehicleAge: "$vehicleAge",
          fuelType: "$fuelType",
          insuranceValidity: "$insuranceValidity",
          fitnessValidity: "$fitnessValidity",
          mulkiyaValidity: "$mulkiyaValidity",
          mulkiyaDocImg: "$mulkiyaDocImg",
          vehicleImage: "$vehicleImage",
          activeStatus: "$activeStatus",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (truckData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(truckData[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(truckData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      totalData:total,
      totalPage: totalPage,
      allOrder: truckData[0].data,
    });
  },
};