const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const AssignZoneForAssignTruckModel = mongoose.model(
  constants.AssignZoneForAssignTruckModel
);
const AssignTruckForDriverModel = mongoose.model(
  constants.AssignTruckForDriverModel
);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
const customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  addAssignZone: async (req, res, next) => {
    // console.log(req.body,"........")
    const find_assignTruck = await AssignTruckForDriverModel.findOne({
      _id: req.body.assignTruckId,
      activeStatus: "1",
    });
    // console.log(find_assignTruck,"....0");
    if (!find_assignTruck) {
      const err = new customError(
        global.CONFIGS.api.AssignTruckForDriverInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    let startDateAndTime = new Date(req.body.startDateAndTime);
    let endDateAndTime = new Date(req.body.endDateAndTime);
    console.log(startDateAndTime,".....startDateAndTime")
    console.log(endDateAndTime,".....endDateAndTime")
    // Calculate the time difference in milliseconds
    let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");
       
    if (timeDifferenceMinutes<=0) {
      const err = new customError(
        global.CONFIGS.api.EnterEndDateGreaterThanStartDate,
        global.CONFIGS.responseCode.exception
      );
      return next(err);
    }
    
    const existing_assignTruck = await AssignZoneForAssignTruckModel.find({
      assignTruckId: req.body.assignTruckId,
      activeStatus: "Active",
    //   sort:({_id: 1,})
    });
    for(var i=0; i<existing_assignTruck.length; i++){
        console.log(existing_assignTruck,".......existing_assignTruck");
        console.log(i, " = hsdhdgdhghdgdhfbdhf")
        console.log(existing_assignTruck[i].endDateAndTime,".......existing_assignTruck.endDateAndTime");
        console.log(existing_assignTruck[i].startDateAndTime,".......existing_assignTruck.startDateAndTime");
    
        let timeDifferenceMillisTwo = existing_assignTruck[i].endDateAndTime - startDateAndTime;
        let timeDifferenceMinutesTwo = Math.floor(timeDifferenceMillisTwo / (1000 * 60));
        console.log(timeDifferenceMinutesTwo, ".....timeDifferenceMinutesTwo");
    
        if(timeDifferenceMinutesTwo>=0){
            const err = new customError(
            global.CONFIGS.api.EnterStartDateGreaterThanEndDate,
            global.CONFIGS.responseCode.exception
        );
        return next(err);
    }
    }
    if (existing_assignTruck) {
    
    }

    const deliveryZones = req.body.deliveryZone.map(
      (item) => item.deliveryZoneId
    );
    // console.log(deliveryZones, "....deliveryZones");

    const find_deliveryZone = await DeliveryZoneModel.find({
      _id: { $in: deliveryZones },
      activeStatus: "Active",
    });
    // console.log(find_deliveryZone, "......find_deliveryZone");

    const find_deliveryZoneLength = find_deliveryZone.length;
    const deliveryZoneIdLength = deliveryZones.length;
    console.log(find_deliveryZoneLength, deliveryZoneIdLength);
    if (find_deliveryZone.length !== deliveryZones.length) {
      const err = new customError(
        global.CONFIGS.api.zoneNameNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    
    const addAssignZoneForAssignTruck = {
      assignTruckId: req.body.assignTruckId,
      deliveryZone: req.body.deliveryZone,
      startDateAndTime: req.body.startDateAndTime,
      endDateAndTime: req.body.endDateAndTime,
    //   timeDifferenceMinutes,
    };
    // return;
    const create_assignZone = await AssignZoneForAssignTruckModel.create(
      addAssignZoneForAssignTruck
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckadded,
      data: create_assignZone,
    });
  },
 
  getAllListAssignZone: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignZoneForAssignTruckModel.aggregate([
      {
        $match: { $or: [
        { activeStatus: "Active" },
        { activeStatus: "Activessed" },
        { activeStatus: "Completed" },
      ]}
      },
      {
        $lookup: {
          from: "assigntruckfordriverdetails",
          localField: "assignTruckId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails",
        },
      },
      { $unwind: "$assigntruckfordriverdetails" },
      { $unset: "assignTruckId" },
      {
        $lookup: {
          from: "truckdetails",
          localField: "assigntruckfordriverdetails.truckId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdetails",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdetails" },
      { $unset: "assigntruckfordriverdetails.truckId" },
      {
        $lookup: {
          from: "truckbrand",
          localField: "assigntruckfordriverdetails.truckdetails.truckBrandId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdetails.truckBrandId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdetails.truckBrandId" },
      
      {
        $lookup: {
          from: "truckmodel",
          localField: "assigntruckfordriverdetails.truckdetails.truckModelId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdetails.truckModelId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdetails.truckModelId" },
     {
        $lookup: {
          from: "truckdriverdetails",
          localField: "assigntruckfordriverdetails.truckDriverId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails" },
      { $unset: "assigntruckfordriverdetails.truckDriverId" },
      {
        $lookup: {
          from: "truckdriverbankdetails",
          localField: "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId" },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField: "assigntruckfordriverdetails.truckdriverdetails.addressId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.addressId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.addressId" },
      {
        $project: {
          _id: "$_id",
            // // //truckDetails:"$assigntruckfordriverdetails.truckdetails",
          truckDetails: {
            TruckId: "$assigntruckfordriverdetails.truckdetails._id",
            ownerName: "$assigntruckfordriverdetails.truckdetails.ownerName",
            truckBrandName: "$assigntruckfordriverdetails.truckdetails.truckBrandId.truckBrand",
            truckModelName: "$assigntruckfordriverdetails.truckdetails.truckModelId.truckModel",
            chasisNumber: "$assigntruckfordriverdetails.truckdetails.chasisNumber",
            vehicleNumber: "$assigntruckfordriverdetails.truckdetails.vehicleNumber",
            registrationZone: "$assigntruckfordriverdetails.truckdetails.registrationZone",
            registrationDate: "$assigntruckfordriverdetails.truckdetails.registrationDate",
            vehicleColor: "$assigntruckfordriverdetails.truckdetails.vehicleColor",
            vehicleYear: "$assigntruckfordriverdetails.truckdetails/vehicleYear",
            vehicleAge: "$assigntruckfordriverdetails.truckdetails.vehicleAge",
            fuelType: "$assigntruckfordriverdetails.truckdetails.fuelType",
            insuranceValidity: "$assigntruckfordriverdetails.truckdetails.insuranceValidity",
            fitnessValidity: "$assigntruckfordriverdetails.truckdetails.fitnessValidity",
            mulkiyaValidity: "$assigntruckfordriverdetails.truckdetails.mulkiyaValidity",
            mulkiyaDocImg: "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg",
            vehicleImage: "$assigntruckfordriverdetails.truckdetails.vehicleImage",
            activeStatus: "$assigntruckfordriverdetails.truckdetails.activeStatus",
          },
          // // // truckDriverDetails:"$assigntruckfordriverdetails.truckdriverdetails",
          
          truckDriverDetails: {
            TruckDriverID: "$assigntruckfordriverdetails.truckdriverdetails._id",
            Name: "$assigntruckfordriverdetails.truckdriverdetails.name",
            Email: "$assigntruckfordriverdetails.truckdriverdetails.email",
            Mobile: "$assigntruckfordriverdetails.truckdriverdetails.mobile",
            AlterNateMobile: "$assigntruckfordriverdetails.truckdriverdetails.altMobile",
            Nationality: "$assigntruckfordriverdetails.truckdriverdetails.nationality",
            PassportNumber: "$assigntruckfordriverdetails.truckdriverdetails.passportNumber",
            PassportValidity: "assigntruckfordriverdetails.$truckdriverdetails.passportValidity",
            VisaNumber: "$assigntruckfordriverdetails.truckdriverdetails.visaNumber",
            VisaValidity: "$assigntruckfordriverdetails.truckdriverdetails.visaValidity",
            EmiratesId: "$assigntruckfordriverdetails.truckdriverdetails.emiratesId",
            EmiratesIdValidity: "$assigntruckfordriverdetails.truckdriverdetails.emiratesIdValidity",
            InsuranceComp: "$assigntruckfordriverdetails.truckdriverdetails.InsuranceComp",
            InsuranceValidity: "$assigntruckfordriverdetails.truckdriverdetails.insuranceValidity",
            LicenseNumber: "$assigntruckfordriverdetails.truckdriverdetails.licenseNumber",
            LicenseCity: "$assigntruckfordriverdetails.truckdriverdetails.licenseCity",
            LicenseType: "$assigntruckfordriverdetails.truckdriverdetails.licenseType",
            LicenseValidity: "$assigntruckfordriverdetails.truckdriverdetails.licenseValidity",
            IsVerified: "$assigntruckfordriverdetails.truckdriverdetails.isVerified",
            DriverType: "$assigntruckfordriverdetails.truckdriverdetails.driverType",
            activeStatus: "$assigntruckfordriverdetails.truckdriverdetails.activeStatus",
            addressId: "$assigntruckfordriverdetails.truckdriverdetails.addressId",
            //////truckDriverBankDetails:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
            truckDriverBankDetails:{
            bankName:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.bankName",
            branchName:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.branchName",
            accountNumber:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountNumber",
            accountHolderName:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountHolderName",
            },
            docId: "$assigntruckfordriverdetails.truckdriverdetails.docId",
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

  getAssignZoneByIdAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignZoneForAssignTruckModel.aggregate([
        {
        $match: { activeStatus: "Active", _id: new ObjectId(req.params.id) }
      },
    //   {
    //     $lookup: {
    //       from: "truckdetails",
    //       localField: "truckId",
    //       foreignField: "_id",
    //       as: "truckdetails",
    //     },
    //   },
    //   { $unwind: "$truckdetails" },
    //   { $unset: "truckId" },
    //   {
    //     $lookup: {
    //       from: "truckbrand",
    //       localField: "truckdetails.truckBrandId",
    //       foreignField: "_id",
    //       as: "truckdetails.truckBrandId",
    //     },
    //   },
    //   { $unwind: "$truckdetails.truckBrandId" },
    //   {
    //     $lookup: {
    //       from: "truckmodel",
    //       localField: "truckdetails.truckModelId",
    //       foreignField: "_id",
    //       as: "truckdetails.truckModelId",
    //     },
    //   },
    //   { $unwind: "$truckdetails.truckModelId" },
    //   {
    //     $lookup: {
    //       from: "truckdriverdetails",
    //       localField: "truckDriverId",
    //       foreignField: "_id",
    //       as: "truckdriverdetails",
    //     },
    //   },
    //   { $unwind: "$truckdriverdetails" },
    //   { $unset: "truckDriverId" },
    //   {
    //     $project: {
    //       _id: "$_id",
    //       truckDetails: {
    //         TruckId: "$truckdetails._id",
    //         ownerName: "$truckdetails.ownerName",
    //         truckBrand: "$truckdetails.truckBrandId.truckBrand",
    //         truckModel: "$truckdetails.truckModelId.truckModel",
    //         chasisNumber: "$truckdetails.chasisNumber",
    //         vehicleNumber: "$truckdetails.vehicleNumber",
    //         registrationZone: "$truckdetails.registrationZone",
    //         registrationDate: "$truckdetails.registrationDate",
    //         vehicleColor: "$truckdetails.vehicleColor",
    //         vehicleYear: "$truckdetails/vehicleYear",
    //         vehicleAge: "$truckdetails.vehicleAge",
    //         fuelType: "$truckdetails.fuelType",
    //         insuranceValidity: "$truckdetails.insuranceValidity",
    //         fitnessValidity: "$truckdetails.fitnessValidity",
    //         mulkiyaValidity: "$truckdetails.mulkiyaValidity",
    //         mulkiyaDocImg: "$truckdetails.mulkiyaDocImg",
    //         vehicleImage: "$truckdetails.vehicleImage",
    //         activeStatus: "$truckdetails.activeStatus",
    //       },
    //       //   truckDriverDetails:"$truckdriverdetails",
    //       truckDriverDetails: {
    //         TruckDriverID: "$truckdriverdetails._id",
    //         Name: "$truckdriverdetails.name",
    //         Email: "$truckdriverdetails.email",
    //         Mobile: "$truckdriverdetails.mobile",
    //         AlterNateMobile: "$truckdriverdetails.altMobile",
    //         Nationality: "$truckdriverdetails.nationality",
    //         PassportNumber: "$truckdriverdetails.passportNumber",
    //         PassportValidity: "$truckdriverdetails.passportValidity",
    //         VisaNumber: "$truckdriverdetails.visaNumber",
    //         VisaValidity: "$truckdriverdetails.visaValidity",
    //         EmiratesId: "$truckdriverdetails.emiratesId",
    //         EmiratesIdValidity: "$truckdriverdetails.emiratesIdValidity",
    //         InsuranceComp: "$truckdriverdetails.InsuranceComp",
    //         InsuranceValidity: "$truckdriverdetails.insuranceValidity",
    //         LicenseNumber: "$truckdriverdetails.licenseNumber",
    //         LicenseCity: "$truckdriverdetails.licenseCity",
    //         LicenseType: "$truckdriverdetails.licenseType",
    //         LicenseValidity: "$truckdriverdetails.licenseValidity",
    //         IsVerified: "$truckdriverdetails.isVerified",
    //         DriverType: "$truckdriverdetails.driverType",
    //         activeStatus: "$truckdriverdetails.activeStatus",
    //         addressId: "$truckdriverdetails.addressId",
    //         bankDetailsId: "$truckdriverdetails.bankDetailsId",
    //         docId: "$truckdriverdetails.docId",
    //       },
    //     },
    //   },
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

  getAssignZoneByAssignTruckId: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignZoneForAssignTruckModel.aggregate([
        {
        $match: { activeStatus: "Active", assignTruckId: new ObjectId(req.params.id) }
      },
    //   {
    //     $lookup: {
    //       from: "truckdetails",
    //       localField: "truckId",
    //       foreignField: "_id",
    //       as: "truckdetails",
    //     },
    //   },
    //   { $unwind: "$truckdetails" },
    //   { $unset: "truckId" },
    //   {
    //     $lookup: {
    //       from: "truckbrand",
    //       localField: "truckdetails.truckBrandId",
    //       foreignField: "_id",
    //       as: "truckdetails.truckBrandId",
    //     },
    //   },
    //   { $unwind: "$truckdetails.truckBrandId" },
    //   {
    //     $lookup: {
    //       from: "truckmodel",
    //       localField: "truckdetails.truckModelId",
    //       foreignField: "_id",
    //       as: "truckdetails.truckModelId",
    //     },
    //   },
    //   { $unwind: "$truckdetails.truckModelId" },
    //   {
    //     $lookup: {
    //       from: "truckdriverdetails",
    //       localField: "truckDriverId",
    //       foreignField: "_id",
    //       as: "truckdriverdetails",
    //     },
    //   },
    //   { $unwind: "$truckdriverdetails" },
    //   { $unset: "truckDriverId" },
    //   {
    //     $project: {
    //       _id: "$_id",
    //       truckDetails: {
    //         TruckId: "$truckdetails._id",
    //         ownerName: "$truckdetails.ownerName",
    //         truckBrand: "$truckdetails.truckBrandId.truckBrand",
    //         truckModel: "$truckdetails.truckModelId.truckModel",
    //         chasisNumber: "$truckdetails.chasisNumber",
    //         vehicleNumber: "$truckdetails.vehicleNumber",
    //         registrationZone: "$truckdetails.registrationZone",
    //         registrationDate: "$truckdetails.registrationDate",
    //         vehicleColor: "$truckdetails.vehicleColor",
    //         vehicleYear: "$truckdetails/vehicleYear",
    //         vehicleAge: "$truckdetails.vehicleAge",
    //         fuelType: "$truckdetails.fuelType",
    //         insuranceValidity: "$truckdetails.insuranceValidity",
    //         fitnessValidity: "$truckdetails.fitnessValidity",
    //         mulkiyaValidity: "$truckdetails.mulkiyaValidity",
    //         mulkiyaDocImg: "$truckdetails.mulkiyaDocImg",
    //         vehicleImage: "$truckdetails.vehicleImage",
    //         activeStatus: "$truckdetails.activeStatus",
    //       },
    //       //   truckDriverDetails:"$truckdriverdetails",
    //       truckDriverDetails: {
    //         TruckDriverID: "$truckdriverdetails._id",
    //         Name: "$truckdriverdetails.name",
    //         Email: "$truckdriverdetails.email",
    //         Mobile: "$truckdriverdetails.mobile",
    //         AlterNateMobile: "$truckdriverdetails.altMobile",
    //         Nationality: "$truckdriverdetails.nationality",
    //         PassportNumber: "$truckdriverdetails.passportNumber",
    //         PassportValidity: "$truckdriverdetails.passportValidity",
    //         VisaNumber: "$truckdriverdetails.visaNumber",
    //         VisaValidity: "$truckdriverdetails.visaValidity",
    //         EmiratesId: "$truckdriverdetails.emiratesId",
    //         EmiratesIdValidity: "$truckdriverdetails.emiratesIdValidity",
    //         InsuranceComp: "$truckdriverdetails.InsuranceComp",
    //         InsuranceValidity: "$truckdriverdetails.insuranceValidity",
    //         LicenseNumber: "$truckdriverdetails.licenseNumber",
    //         LicenseCity: "$truckdriverdetails.licenseCity",
    //         LicenseType: "$truckdriverdetails.licenseType",
    //         LicenseValidity: "$truckdriverdetails.licenseValidity",
    //         IsVerified: "$truckdriverdetails.isVerified",
    //         DriverType: "$truckdriverdetails.driverType",
    //         activeStatus: "$truckdriverdetails.activeStatus",
    //         addressId: "$truckdriverdetails.addressId",
    //         bankDetailsId: "$truckdriverdetails.bankDetailsId",
    //         docId: "$truckdriverdetails.docId",
    //       },
    //     },
    //   },
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

};
