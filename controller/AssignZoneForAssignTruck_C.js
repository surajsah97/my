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
    console.log(startDateAndTime, ".....startDateAndTime");
    console.log(endDateAndTime, ".....endDateAndTime");
    // Calculate the time difference in milliseconds
    let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");

    if (timeDifferenceMinutes <= 0) {
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
    for (var i = 0; i < existing_assignTruck.length; i++) {
      console.log(existing_assignTruck, ".......existing_assignTruck");
      console.log(i, " = hsdhdgdhghdgdhfbdhf");
      console.log(
        existing_assignTruck[i].endDateAndTime,
        ".......existing_assignTruck.endDateAndTime"
      );
      console.log(
        existing_assignTruck[i].startDateAndTime,
        ".......existing_assignTruck.startDateAndTime"
      );

      let timeDifferenceMillisTwo =
        existing_assignTruck[i].endDateAndTime - startDateAndTime;
      let timeDifferenceMinutesTwo = Math.floor(
        timeDifferenceMillisTwo / (1000 * 60)
      );
      console.log(timeDifferenceMinutesTwo, ".....timeDifferenceMinutesTwo");

      if (timeDifferenceMinutesTwo >= 0) {
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
        $match: {
          $or: [
            { activeStatus: "Active" },
            { activeStatus: "Activessed" },
            { activeStatus: "Completed" },
          ],
        },
      },
      {
        $lookup: {
          from: "deliveryzone",
          localField: "deliveryZone.deliveryZoneId",
          foreignField: "_id",
          as: "deliveryZone.deliveryZoneId",
        },
      },
      {
        $unwind: {
          path: "$deliveryZone.deliveryZoneId",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
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
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
        },
      },
      {
        $unwind:
          "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
      },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.addressId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.addressId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "assigntruckfordriverdetails.truckdriverdetails.docId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.docId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.docId" },
      {
        $project: {
          // _id: 1,
          _id: "$_id",
          totalStock: "$totalStock",
          deliverdStock: "$deliverdStock",
          returnedStock: "$returnedStock",
          damagedStock: "$damagedStock",
          // deliveryZoneDetails:"$deliveryZone.deliveryZoneId",
          deliveryZoneDetails: {
            _id: "$deliveryZone.deliveryZoneId._id",
            zoneName: "$deliveryZone.deliveryZoneId.zoneName",
            country: "$deliveryZone.deliveryZoneId.country",
            activeStatus: "$deliveryZone.deliveryZoneId.activeStatus",
            createdAt: "$deliveryZone.deliveryZoneId.createdAt",
            updatedAt: "$deliveryZone.deliveryZoneId.updatedAt",
          },
          startDateAndTime: "$startDateAndTime",
          endDateAndTime: "$endDateAndTime",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",

          // // //truckDetails:"$assigntruckfordriverdetails.truckdetails",
          truckDetails: {
            TruckId: "$assigntruckfordriverdetails.truckdetails._id",
            ownerName: "$assigntruckfordriverdetails.truckdetails.ownerName",
            truckBrandName:
              "$assigntruckfordriverdetails.truckdetails.truckBrandId.truckBrand",
            truckModelName:
              "$assigntruckfordriverdetails.truckdetails.truckModelId.truckModel",
            chasisNumber:
              "$assigntruckfordriverdetails.truckdetails.chasisNumber",
            vehicleNumber:
              "$assigntruckfordriverdetails.truckdetails.vehicleNumber",
            registrationZone:
              "$assigntruckfordriverdetails.truckdetails.registrationZone",
            registrationDate:
              "$assigntruckfordriverdetails.truckdetails.registrationDate",
            vehicleColor:
              "$assigntruckfordriverdetails.truckdetails.vehicleColor",
            vehicleYear:
              "$assigntruckfordriverdetails.truckdetails/vehicleYear",
            vehicleAge: "$assigntruckfordriverdetails.truckdetails.vehicleAge",
            fuelType: "$assigntruckfordriverdetails.truckdetails.fuelType",
            insuranceValidity:
              "$assigntruckfordriverdetails.truckdetails.insuranceValidity",
            fitnessValidity:
              "$assigntruckfordriverdetails.truckdetails.fitnessValidity",
            mulkiyaValidity:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaValidity",
            mulkiyaDocFrontImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.frontImg",
            mulkiyaDocBackImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.backImg",
            vehicleFrontImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.frontImage",
            vehicleBackImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.backImage",
            vehicleLeftImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.leftImage",
            vehicleRightImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.rightImage",
            activeStatus:
              "$assigntruckfordriverdetails.truckdetails.activeStatus",
          },
          // // // truckDriverDetails:"$assigntruckfordriverdetails.truckdriverdetails",

          truckDriverDetails: {
            TruckDriverID:
              "$assigntruckfordriverdetails.truckdriverdetails._id",
            Name: "$assigntruckfordriverdetails.truckdriverdetails.name",
            Email: "$assigntruckfordriverdetails.truckdriverdetails.email",
            Mobile: "$assigntruckfordriverdetails.truckdriverdetails.mobile",
            AlterNateMobile:
              "$assigntruckfordriverdetails.truckdriverdetails.altMobile",
            Nationality:
              "$assigntruckfordriverdetails.truckdriverdetails.nationality",
            PassportNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.passportNumber",
            PassportValidity:
              "assigntruckfordriverdetails.$truckdriverdetails.passportValidity",
            VisaNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.visaNumber",
            VisaValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.visaValidity",
            EmiratesId:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesId",
            EmiratesIdValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesIdValidity",
            InsuranceComp:
              "$assigntruckfordriverdetails.truckdriverdetails.InsuranceComp",
            InsuranceValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.insuranceValidity",
            LicenseNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseNumber",
            LicenseCity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseCity",
            LicenseType:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseType",
            LicenseValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseValidity",
            IsVerified:
              "$assigntruckfordriverdetails.truckdriverdetails.isVerified",
            DriverType:
              "$assigntruckfordriverdetails.truckdriverdetails.driverType",
            activeStatus:
              "$assigntruckfordriverdetails.truckdriverdetails.activeStatus",
            // addressId: "$assigntruckfordriverdetails.truckdriverdetails.addressId",
            truckDriverAddressDetails: {
              localAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.buildingName",
              localAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.street",
              homeCountryAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.houseNo",
              homeCountryAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.buildingName",
              homeCountryAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.street",
              homeCountryAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.landmark",
              homeCountryAddressCity:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.city",
              homeCountryAddressState:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.state",
              homeCountryAddressPinCode:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.pinCode",
              emergencyContactName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.name",
              emergencyContactRelation:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.relation",
              emergencyContactMobile:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.mobile",
            },
            // // //truckDriverBankDetails:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
            truckDriverBankDetails: {
              bankName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.bankName",
              accountNumber:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountNumber",
              accountHolderName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountHolderName",
              branchName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.branchName",
              IBAN: "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.IBAN",
            },
            // docId: "$assigntruckfordriverdetails.truckdriverdetails.docId",
            truckDriverDocumentDetails: {
              passportFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.frontImg",
              passportBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.backImg",
              emiratesIdFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.frontImg",
              emiratesIdBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.backImg",
              licenseFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.frontImg",
              licenseBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.backImg",
              visaImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.visaImg",
              driverImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.driverImg",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalStock: { $first: "$totalStock" },
          deliverdStock: { $first: "$deliverdStock" },
          returnedStock: { $first: "$returnedStock" },
          damagedStock: { $first: "$damagedStock" },
          zoneDetails: {
            $addToSet: "$deliveryZoneDetails",
          },
          startDateAndTime: { $first: "$startDateAndTime" },
          endDateAndTime: { $first: "$endDateAndTime" },
          activeStatus: { $first: "$activeStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          truckDetails: { $first: "$truckDetails" },
          truckDriverDetails: { $first: "$truckDriverDetails" },
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
    var totalPage = Math.ceil(
      parseInt(assignTruckData[0].metadata[0].total) / limit
    );
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
        $match: { activeStatus: "Active", _id: new ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "deliveryzone",
          localField: "deliveryZone.deliveryZoneId",
          foreignField: "_id",
          as: "deliveryZone.deliveryZoneId",
        },
      },
      {
        $unwind: {
          path: "$deliveryZone.deliveryZoneId",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
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
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
        },
      },
      {
        $unwind:
          "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
      },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.addressId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.addressId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "assigntruckfordriverdetails.truckdriverdetails.docId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.docId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.docId" },
      {
        $project: {
          // _id: 1,
          _id: "$_id",
          totalStock: "$totalStock",
          deliverdStock: "$deliverdStock",
          returnedStock: "$returnedStock",
          damagedStock: "$damagedStock",
          // deliveryZoneDetails:"$deliveryZone.deliveryZoneId",
          deliveryZoneDetails: {
            _id: "$deliveryZone.deliveryZoneId._id",
            zoneName: "$deliveryZone.deliveryZoneId.zoneName",
            country: "$deliveryZone.deliveryZoneId.country",
            activeStatus: "$deliveryZone.deliveryZoneId.activeStatus",
            createdAt: "$deliveryZone.deliveryZoneId.createdAt",
            updatedAt: "$deliveryZone.deliveryZoneId.updatedAt",
          },
          startDateAndTime: "$startDateAndTime",
          endDateAndTime: "$endDateAndTime",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",

          // // //truckDetails:"$assigntruckfordriverdetails.truckdetails",
          truckDetails: {
            TruckId: "$assigntruckfordriverdetails.truckdetails._id",
            ownerName: "$assigntruckfordriverdetails.truckdetails.ownerName",
            truckBrandName:
              "$assigntruckfordriverdetails.truckdetails.truckBrandId.truckBrand",
            truckModelName:
              "$assigntruckfordriverdetails.truckdetails.truckModelId.truckModel",
            chasisNumber:
              "$assigntruckfordriverdetails.truckdetails.chasisNumber",
            vehicleNumber:
              "$assigntruckfordriverdetails.truckdetails.vehicleNumber",
            registrationZone:
              "$assigntruckfordriverdetails.truckdetails.registrationZone",
            registrationDate:
              "$assigntruckfordriverdetails.truckdetails.registrationDate",
            vehicleColor:
              "$assigntruckfordriverdetails.truckdetails.vehicleColor",
            vehicleYear:
              "$assigntruckfordriverdetails.truckdetails/vehicleYear",
            vehicleAge: "$assigntruckfordriverdetails.truckdetails.vehicleAge",
            fuelType: "$assigntruckfordriverdetails.truckdetails.fuelType",
            insuranceValidity:
              "$assigntruckfordriverdetails.truckdetails.insuranceValidity",
            fitnessValidity:
              "$assigntruckfordriverdetails.truckdetails.fitnessValidity",
            mulkiyaValidity:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaValidity",
            mulkiyaDocFrontImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.frontImg",
            mulkiyaDocBackImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.backImg",
            vehicleFrontImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.frontImage",
            vehicleBackImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.backImage",
            vehicleLeftImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.leftImage",
            vehicleRightImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.rightImage",
            activeStatus:
              "$assigntruckfordriverdetails.truckdetails.activeStatus",
          },
          // // // truckDriverDetails:"$assigntruckfordriverdetails.truckdriverdetails",

          truckDriverDetails: {
            TruckDriverID:
              "$assigntruckfordriverdetails.truckdriverdetails._id",
            Name: "$assigntruckfordriverdetails.truckdriverdetails.name",
            Email: "$assigntruckfordriverdetails.truckdriverdetails.email",
            Mobile: "$assigntruckfordriverdetails.truckdriverdetails.mobile",
            AlterNateMobile:
              "$assigntruckfordriverdetails.truckdriverdetails.altMobile",
            Nationality:
              "$assigntruckfordriverdetails.truckdriverdetails.nationality",
            PassportNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.passportNumber",
            PassportValidity:
              "assigntruckfordriverdetails.$truckdriverdetails.passportValidity",
            VisaNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.visaNumber",
            VisaValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.visaValidity",
            EmiratesId:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesId",
            EmiratesIdValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesIdValidity",
            InsuranceComp:
              "$assigntruckfordriverdetails.truckdriverdetails.InsuranceComp",
            InsuranceValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.insuranceValidity",
            LicenseNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseNumber",
            LicenseCity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseCity",
            LicenseType:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseType",
            LicenseValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseValidity",
            IsVerified:
              "$assigntruckfordriverdetails.truckdriverdetails.isVerified",
            DriverType:
              "$assigntruckfordriverdetails.truckdriverdetails.driverType",
            activeStatus:
              "$assigntruckfordriverdetails.truckdriverdetails.activeStatus",
            // addressId: "$assigntruckfordriverdetails.truckdriverdetails.addressId",
            truckDriverAddressDetails: {
              localAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.buildingName",
              localAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.street",
              homeCountryAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.houseNo",
              homeCountryAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.buildingName",
              homeCountryAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.street",
              homeCountryAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.landmark",
              homeCountryAddressCity:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.city",
              homeCountryAddressState:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.state",
              homeCountryAddressPinCode:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.pinCode",
              emergencyContactName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.name",
              emergencyContactRelation:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.relation",
              emergencyContactMobile:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.mobile",
            },
            // // //truckDriverBankDetails:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
            truckDriverBankDetails: {
              bankName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.bankName",
              accountNumber:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountNumber",
              accountHolderName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountHolderName",
              branchName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.branchName",
              IBAN: "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.IBAN",
            },
            // docId: "$assigntruckfordriverdetails.truckdriverdetails.docId",
            truckDriverDocumentDetails: {
              passportFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.frontImg",
              passportBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.backImg",
              emiratesIdFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.frontImg",
              emiratesIdBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.backImg",
              licenseFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.frontImg",
              licenseBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.backImg",
              visaImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.visaImg",
              driverImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.driverImg",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalStock: { $first: "$totalStock" },
          deliverdStock: { $first: "$deliverdStock" },
          returnedStock: { $first: "$returnedStock" },
          damagedStock: { $first: "$damagedStock" },
          zoneDetails: {
            $addToSet: "$deliveryZoneDetails",
          },
          startDateAndTime: { $first: "$startDateAndTime" },
          endDateAndTime: { $first: "$endDateAndTime" },
          activeStatus: { $first: "$activeStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          truckDetails: { $first: "$truckDetails" },
          truckDriverDetails: { $first: "$truckDriverDetails" },
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
    var totalPage = Math.ceil(
      parseInt(assignTruckData[0].metadata[0].total) / limit
    );
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
        $match: {
          activeStatus: "Active",
          assignTruckId: new ObjectId(req.params.id),
        },
      },
     {
        $lookup: {
          from: "deliveryzone",
          localField: "deliveryZone.deliveryZoneId",
          foreignField: "_id",
          as: "deliveryZone.deliveryZoneId",
        },
      },
      {
        $unwind: {
          path: "$deliveryZone.deliveryZoneId",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
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
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
        },
      },
      {
        $unwind:
          "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
      },
      {
        $lookup: {
          from: "truckdriveraddress",
          localField:
            "assigntruckfordriverdetails.truckdriverdetails.addressId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.addressId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.addressId" },
      {
        $lookup: {
          from: "truckdriverdoc",
          localField: "assigntruckfordriverdetails.truckdriverdetails.docId",
          foreignField: "_id",
          as: "assigntruckfordriverdetails.truckdriverdetails.docId",
        },
      },
      { $unwind: "$assigntruckfordriverdetails.truckdriverdetails.docId" },
      {
        $project: {
          // _id: 1,
          _id: "$_id",
          totalStock: "$totalStock",
          deliverdStock: "$deliverdStock",
          returnedStock: "$returnedStock",
          damagedStock: "$damagedStock",
          // deliveryZoneDetails:"$deliveryZone.deliveryZoneId",
          deliveryZoneDetails: {
            _id: "$deliveryZone.deliveryZoneId._id",
            zoneName: "$deliveryZone.deliveryZoneId.zoneName",
            country: "$deliveryZone.deliveryZoneId.country",
            activeStatus: "$deliveryZone.deliveryZoneId.activeStatus",
            createdAt: "$deliveryZone.deliveryZoneId.createdAt",
            updatedAt: "$deliveryZone.deliveryZoneId.updatedAt",
          },
          startDateAndTime: "$startDateAndTime",
          endDateAndTime: "$endDateAndTime",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",

          // // //truckDetails:"$assigntruckfordriverdetails.truckdetails",
          truckDetails: {
            TruckId: "$assigntruckfordriverdetails.truckdetails._id",
            ownerName: "$assigntruckfordriverdetails.truckdetails.ownerName",
            truckBrandName:
              "$assigntruckfordriverdetails.truckdetails.truckBrandId.truckBrand",
            truckModelName:
              "$assigntruckfordriverdetails.truckdetails.truckModelId.truckModel",
            chasisNumber:
              "$assigntruckfordriverdetails.truckdetails.chasisNumber",
            vehicleNumber:
              "$assigntruckfordriverdetails.truckdetails.vehicleNumber",
            registrationZone:
              "$assigntruckfordriverdetails.truckdetails.registrationZone",
            registrationDate:
              "$assigntruckfordriverdetails.truckdetails.registrationDate",
            vehicleColor:
              "$assigntruckfordriverdetails.truckdetails.vehicleColor",
            vehicleYear:
              "$assigntruckfordriverdetails.truckdetails/vehicleYear",
            vehicleAge: "$assigntruckfordriverdetails.truckdetails.vehicleAge",
            fuelType: "$assigntruckfordriverdetails.truckdetails.fuelType",
            insuranceValidity:
              "$assigntruckfordriverdetails.truckdetails.insuranceValidity",
            fitnessValidity:
              "$assigntruckfordriverdetails.truckdetails.fitnessValidity",
            mulkiyaValidity:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaValidity",
            mulkiyaDocFrontImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.frontImg",
            mulkiyaDocBackImg:
              "$assigntruckfordriverdetails.truckdetails.mulkiyaDocImg.backImg",
            vehicleFrontImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.frontImage",
            vehicleBackImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.backImage",
            vehicleLeftImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.leftImage",
            vehicleRightImage:
              "$assigntruckfordriverdetails.truckdetails.vehicleImage.rightImage",
            activeStatus:
              "$assigntruckfordriverdetails.truckdetails.activeStatus",
          },
          // // // truckDriverDetails:"$assigntruckfordriverdetails.truckdriverdetails",

          truckDriverDetails: {
            TruckDriverID:
              "$assigntruckfordriverdetails.truckdriverdetails._id",
            Name: "$assigntruckfordriverdetails.truckdriverdetails.name",
            Email: "$assigntruckfordriverdetails.truckdriverdetails.email",
            Mobile: "$assigntruckfordriverdetails.truckdriverdetails.mobile",
            AlterNateMobile:
              "$assigntruckfordriverdetails.truckdriverdetails.altMobile",
            Nationality:
              "$assigntruckfordriverdetails.truckdriverdetails.nationality",
            PassportNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.passportNumber",
            PassportValidity:
              "assigntruckfordriverdetails.$truckdriverdetails.passportValidity",
            VisaNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.visaNumber",
            VisaValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.visaValidity",
            EmiratesId:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesId",
            EmiratesIdValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.emiratesIdValidity",
            InsuranceComp:
              "$assigntruckfordriverdetails.truckdriverdetails.InsuranceComp",
            InsuranceValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.insuranceValidity",
            LicenseNumber:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseNumber",
            LicenseCity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseCity",
            LicenseType:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseType",
            LicenseValidity:
              "$assigntruckfordriverdetails.truckdriverdetails.licenseValidity",
            IsVerified:
              "$assigntruckfordriverdetails.truckdriverdetails.isVerified",
            DriverType:
              "$assigntruckfordriverdetails.truckdriverdetails.driverType",
            activeStatus:
              "$assigntruckfordriverdetails.truckdriverdetails.activeStatus",
            // addressId: "$assigntruckfordriverdetails.truckdriverdetails.addressId",
            truckDriverAddressDetails: {
              localAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.buildingName",
              localAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
              localAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.localAddress.street",
              homeCountryAddressHouseNo:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.houseNo",
              homeCountryAddressBuildingName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.buildingName",
              homeCountryAddressStreet:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.street",
              homeCountryAddressLandmark:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.landmark",
              homeCountryAddressCity:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.city",
              homeCountryAddressState:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.state",
              homeCountryAddressPinCode:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.homeCountryAddress.pinCode",
              emergencyContactName:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.name",
              emergencyContactRelation:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.relation",
              emergencyContactMobile:
                "$assigntruckfordriverdetails.truckdriverdetails.addressId.emergencyContact.mobile",
            },
            // // //truckDriverBankDetails:"$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId",
            truckDriverBankDetails: {
              bankName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.bankName",
              accountNumber:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountNumber",
              accountHolderName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.accountHolderName",
              branchName:
                "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.branchName",
              IBAN: "$assigntruckfordriverdetails.truckdriverdetails.bankDetailsId.IBAN",
            },
            // docId: "$assigntruckfordriverdetails.truckdriverdetails.docId",
            truckDriverDocumentDetails: {
              passportFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.frontImg",
              passportBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.passportImg.backImg",
              emiratesIdFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.frontImg",
              emiratesIdBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.emiratesIdImg.backImg",
              licenseFrontImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.frontImg",
              licenseBackImage:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.licenseImg.backImg",
              visaImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.visaImg",
              driverImg:
                "$assigntruckfordriverdetails.truckdriverdetails.docId.driverImg",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalStock: { $first: "$totalStock" },
          deliverdStock: { $first: "$deliverdStock" },
          returnedStock: { $first: "$returnedStock" },
          damagedStock: { $first: "$damagedStock" },
          zoneDetails: {
            $addToSet: "$deliveryZoneDetails",
          },
          startDateAndTime: { $first: "$startDateAndTime" },
          endDateAndTime: { $first: "$endDateAndTime" },
          activeStatus: { $first: "$activeStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          truckDetails: { $first: "$truckDetails" },
          truckDriverDetails: { $first: "$truckDriverDetails" },
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
    var totalPage = Math.ceil(
      parseInt(assignTruckData[0].metadata[0].total) / limit
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignTruckForDriverListAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignTruckData[0].data,
    });
  },
};
