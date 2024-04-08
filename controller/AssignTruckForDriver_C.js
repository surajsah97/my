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
    console.log(req.body,"........")
    const find_truck = await TruckDetailModel.findOne({ _id: req.body.truckId, activeStatus: "1" });
    if (!find_truck) {
        const err = new customError(global.CONFIGS.api.truckDetailsInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
    }
    const find_truckDriver = await TruckDriverModel.findOne({ _id: req.body.truckDriverId, activeStatus: "1" });
    if (!find_truckDriver) {
        const err = new customError(global.CONFIGS.api.truckDriverInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
    }
    const find_assignTruck = await AssignTruckForDriverModel.findOne({
      $or: [
        { truckId: req.body.truckId },
        { truckDriverId: req.body.truckDriverId },
      ],
    });
    if (find_assignTruck) {
      const err = new customError(
        global.CONFIGS.api.AssignTruckForDriveralreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_assignTruck = await AssignTruckForDriverModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignTruckForDriveradded,
      data: create_assignTruck,
    });
  },

  getAllListAssignBYAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignTruckForDriverModel.aggregate([
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
    if (assignTruckData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.AssignTruckForDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(assignTruckData[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(assignTruckData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignTruckForDriverListAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignTruckData[0].data,
    });
  },

  getAssignBYIdAdmin: async (req, res, next) => {
    // console.log(req.params.id,"...")
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignTruckForDriverModel.aggregate([
      {
        $match: { activeStatus: "1", _id: new ObjectId(req.params.id) }
      },
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
    if (assignTruckData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.AssignTruckForDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(assignTruckData[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(assignTruckData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignTruckForDriverByIdAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignTruckData[0].data,
    });
  },
  getAssignTruckByTruckDriverId: async (req, res, next) => {
    // console.log(req.params.id,"...")
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignTruckForDriverModel.aggregate([
      {
        $match: { activeStatus: "1", truckDriverId: new ObjectId(req.params.id) }
      },
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
    if (assignTruckData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.AssignTruckForDriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(assignTruckData[0].metadata[0].total);
    var totalPage = Math.ceil(parseInt(assignTruckData[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignTruckForDriverByIdAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignTruckData[0].data,
    });
  },

  assignDeleteById: async (req, res, next) => {
        const delete_brand = await AssignTruckForDriverModel.findByIdAndDelete({ _id:new ObjectId(req.params.id)});
        if(!delete_brand){
            const err = new customError(
          global.CONFIGS.api.AssignTruckForDriverNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
        }
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.AssignTruckForDriverDelete,
        })
    },

 assignUpdateById: async (req, res, next) => {
        let find_assignTruck = await AssignTruckForDriverModel.findById(req.params.id);
        console.log(find_assignTruck,"....find_assignTruck")
        if (!find_assignTruck) {
        const err = new customError(global.CONFIGS.api.AssignTruckForDriverInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
        
        const existing_assignTruck = await AssignTruckForDriverModel.findOne({
         $or: [
            { truckId: req.body.truckId },
            { truckDriverId: req.body.truckDriverId },
        ],
        });
        if (existing_assignTruck) {
        const err = new customError(
        global.CONFIGS.api.AssignTruckForDriveralreadyadded,
        global.CONFIGS.responseCode.alreadyExist
        );
        return next(err);
        }

        if(req.body.truckId!=undefined){
            let find_truck = await TruckDetailModel.findById(new ObjectId(req.body.truckId));
            if (!find_truck) {
            const err = new customError(global.CONFIGS.api.truckDetailsInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
            }
        }
        if(req.body.truckDriverId!=undefined){
            let find_truckDriver = await TruckDriverModel.findById(new ObjectId(req.body.truckDriverId));
            if (!find_truckDriver) {
            const err = new customError(global.CONFIGS.api.truckDriverInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
            }
        }
        
        if(req.body.activeStatus!=undefined){
            let validactiveStatus = ["0","1"];
            if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
            return next(err);
            }
        }

        find_assignTruck = await AssignTruckForDriverModel.findByIdAndUpdate( req.params.id , req.body,{new:true});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.AssignTruckForDriverUpdated,
            data:find_assignTruck
        })
    },
};
