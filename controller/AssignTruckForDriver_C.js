const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckDriverModel = mongoose.model(constants.TruckDriverModel);
const TruckDetailModel = mongoose.model(constants.TruckDetailModel);
const AssignTruckForDriverModel = mongoose.model(
  constants.AssignTruckForDriverModel
);
const ObjectId = mongoose.Types.ObjectId;
const customError = require("../middleware/customerror");

module.exports = {
  asignTruck: async (req, res, next) => {
    var find_truck = await TruckDetailModel.findOne({ _id: req.body.truckId, activeStatus: "1" });
    if (!find_truck) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
    }
    var find_truckDriver = await TruckDriverModel.findOne({ _id: req.body.truckDriverId, activeStatus: "1" });
    if (!find_truckDriver) {
        const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
    }
    var find_assignTruck = await AssignTruckForDriverModel.findOne({
      $or: [
        { truckId: req.body.truckId },
        { truckDriverId: req.body.truckDriverId },
      ],
    });
    if (find_assignTruck) {
      const err = new customError(
        global.CONFIGS.api.modelalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_assignTruck = await AssignTruckForDriverModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.modeladded,
      data: create_assignTruck,
    });
  },

  getAllListAssignBYAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let truckData = await AssignTruckForDriverModel.aggregate([
      {
        $lookup: {
          from: "truckdetails",
          localField: "truckId",
          foreignField: "_id",
          as: "truckdetails",
        },
      },
      { $unwind: "$truckdetails" },
      { $unset: "truckId" },
      {
        $lookup: {
          from: "truckbrand",
          localField: "truckdetails.truckBrandId",
          foreignField: "_id",
          as: "truckdetails.truckBrandId",
        },
      },
      { $unwind: "$truckdetails.truckBrandId" },
      {
        $lookup: {
          from: "truckmodel",
          localField: "truckdetails.truckModelId",
          foreignField: "_id",
          as: "truckdetails.truckModelId",
        },
      },
      { $unwind: "$truckdetails.truckModelId" },
      {
        $lookup: {
          from: "truckdriverdetails",
          localField: "truckDriverId",
          foreignField: "_id",
          as: "truckdriverdetails",
        },
      },
      { $unwind: "$truckdriverdetails" },
      { $unset: "truckDriverId" },
      {
        $project: {
          _id: "$_id",
          truckDetails: {
            TruckId: "$truckdetails._id",
            ownerName: "$truckdetails.ownerName",
            truckBrand: "$truckdetails.truckBrandId.truckBrand",
            truckModel: "$truckdetails.truckModelId.truckModel",
            chasisNumber: "$truckdetails.chasisNumber",
            vehicleNumber: "$truckdetails.vehicleNumber",
            registrationZone: "$truckdetails.registrationZone",
            registrationDate: "$truckdetails.registrationDate",
            vehicleColor: "$truckdetails.vehicleColor",
            vehicleYear: "$truckdetails/vehicleYear",
            vehicleAge: "$truckdetails.vehicleAge",
            fuelType: "$truckdetails.fuelType",
            insuranceValidity: "$truckdetails.insuranceValidity",
            fitnessValidity: "$truckdetails.fitnessValidity",
            mulkiyaValidity: "$truckdetails.mulkiyaValidity",
            mulkiyaDocImg: "$truckdetails.mulkiyaDocImg",
            vehicleImage: "$truckdetails.vehicleImage",
            activeStatus: "$truckdetails.activeStatus",
          },
          //   truckDriverDetails:"$truckdriverdetails",
          truckDriverDetails: {
            TruckDriverID: "$truckdriverdetails._id",
            Name: "$truckdriverdetails.name",
            Email: "$truckdriverdetails.email",
            Mobile: "$truckdriverdetails.mobile",
            AlterNateMobile: "$truckdriverdetails.altMobile",
            Nationality: "$truckdriverdetails.nationality",
            PassportNumber: "$truckdriverdetails.passportNumber",
            PassportValidity: "$truckdriverdetails.passportValidity",
            VisaNumber: "$truckdriverdetails.visaNumber",
            VisaValidity: "$truckdriverdetails.visaValidity",
            EmiratesId: "$truckdriverdetails.emiratesId",
            EmiratesIdValidity: "$truckdriverdetails.emiratesIdValidity",
            InsuranceComp: "$truckdriverdetails.InsuranceComp",
            InsuranceValidity: "$truckdriverdetails.insuranceValidity",
            LicenseNumber: "$truckdriverdetails.licenseNumber",
            LicenseCity: "$truckdriverdetails.licenseCity",
            LicenseType: "$truckdriverdetails.licenseType",
            LicenseValidity: "$truckdriverdetails.licenseValidity",
            IsVerified: "$truckdriverdetails.isVerified",
            DriverType: "$truckdriverdetails.driverType",
            activeStatus: "$truckdriverdetails.activeStatus",
            addressId: "$truckdriverdetails.addressId",
            bankDetailsId: "$truckdriverdetails.bankDetailsId",
            docId: "$truckdriverdetails.docId",
          },
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
      totalData: total,
      totalPage: totalPage,
      allOrder: truckData[0].data,
    });
  },
};
