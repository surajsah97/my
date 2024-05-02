const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const AssignOrderForBikeDriverModel = mongoose.model(
  constants.AssignOrderForBikeDriverModel
);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const ProductOrderModel = mongoose.model(constants.ProductOrderModel);
const customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  addAssignOrderForBikeDriver: async (req, res, next) => {
    // console.log(req.body,"........req.body")
    const find_deliveryZone = await DeliveryZoneModel.findOne({
      _id: req.body.deliveryZoneId,
      activeStatus: "Active",
    });
    // console.log(find_deliveryZone,"....find_deliveryZone1");
    if (!find_deliveryZone) {
      const err = new customError(
        global.CONFIGS.api.zoneNameInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const find_bikeDriver = await BikeDriverModel.findOne({
      _id: req.body.bikeDriverId,
      activeStatus: "1",
    });
    // console.log(find_bikeDriver,"....find_bikeDriver");
    if (!find_bikeDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    /**ForStartTime_EndTime */
    // let startDateAndTime = new Date(req.body.startDateAndTime);
    // let endDateAndTime = new Date(req.body.endDateAndTime);
    // console.log(startDateAndTime, ".....startDateAndTime");
    // console.log(endDateAndTime, ".....endDateAndTime");
    // // Calculate the time difference in milliseconds
    // let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    // let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    // console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");

    // if (timeDifferenceMinutes <= 0) {
    //   const err = new customError(
    //     global.CONFIGS.api.EnterEndDateGreaterThanStartDate,
    //     global.CONFIGS.responseCode.exception
    //   );
    //   return next(err);
    // }
     /**ForStartTime_EndTime */
    /**Oldstart */
    // let totalBottleCapacity = req.body.totalBottleCapacity;
    // console.log(totalBottleCapacity, "......totalBottleCapacity");
    /**Old End */
    let totalReserveCapacity = req.body.totalReserveCapacity;
    console.log(totalReserveCapacity, "......totalReserveCapacity");
    let damagedBottle = req.body.damagedBottle;
    console.log(damagedBottle, "......damagedBottle");
    let leakageBottle = req.body.leakageBottle;
    console.log(leakageBottle, "......leakageBottle");
    let brokenBottle = req.body.brokenBottle;
    console.log(brokenBottle, "......brokenBottle");
    let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    console.log(returnedReserveBottle, "......returnedReserveBottle");
    /**ForStartTime_EndTime */
    // const existing_bikeDriver = await AssignOrderForBikeDriverModel.find({
    //   bikeDriverId: req.body.bikeDriverId,
    //   activeStatus: "Active",
    //   //   sort:({_id: 1,})
    // });
    // for (var i = 0; i < existing_bikeDriver.length; i++) {
    //   console.log(existing_bikeDriver, ".......existing_bikeDriver");
    //   console.log(i, " = hsdhdgdhghdgdhfbdhf");
    //   console.log(
    //     existing_bikeDriver[i].endDateAndTime,
    //     ".......existing_bikeDriver.endDateAndTime"
    //   );
    //   console.log(
    //     existing_bikeDriver[i].startDateAndTime,
    //     ".......existing_bikeDriver.startDateAndTime"
    //   );

    //   let timeDifferenceMillisTwo =
    //     existing_bikeDriver[i].endDateAndTime - startDateAndTime;
    //   let timeDifferenceMinutesTwo = Math.floor(
    //     timeDifferenceMillisTwo / (1000 * 60)
    //   );
    //   console.log(timeDifferenceMinutesTwo, ".....timeDifferenceMinutesTwo");

    //   if (timeDifferenceMinutesTwo >= 0) {
    //     const err = new customError(
    //       global.CONFIGS.api.EnterStartDateGreaterThanEndDate,
    //       global.CONFIGS.responseCode.exception
    //     );
    //     return next(err);
    //   }
    // }
    /**ForStartTime_Endtime */
    /**Old Start*/
    const productOrdered = req.body.productOrder.map(
      (item) => item.productOrderId
    );
    console.log(productOrdered, "....productOrdered");

    const find_productOrder = await ProductOrderModel.find({
      _id: { $in: productOrdered },
      status: "Pending",
    });
    console.log(find_productOrder, "......find_productOrder");
    /**Old End */

    const productOrderOfproduct = find_productOrder.reduce((accumulator, order) => {
        let totalQty = 0;

        order.product.forEach(item => {
        totalQty += item.qty;
        });
      return accumulator + totalQty;
    }, 0);
    console.log(productOrderOfproduct, "....productOrderOfproduct..");
    // return
    const find_productOrderLength = find_productOrder.length;
    const productOrderIdLength = productOrdered.length;
    console.log(find_productOrderLength, productOrderIdLength);
    if (find_productOrder.length !== productOrdered.length) {
      const err = new customError(
        global.CONFIGS.api.OrderNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const addAssignOderForBikeDriver = {
      deliveryZoneId: req.body.deliveryZoneId,
      bikeDriverId: req.body.bikeDriverId,
      productOrder: req.body.productOrder,
    //   startDateAndTime: req.body.startDateAndTime,
    //   endDateAndTime: req.body.endDateAndTime,
      totalBottleCapacity:productOrderOfproduct,
    //   totalBottleCapacity,
      totalReserveCapacity: req.body.totalReserveCapacity,
      damagedBottle,
      leakageBottle,
      brokenBottle,
      deliveredReserveBottle: deliveredReserveBottle,
      returnedReserveBottle:returnedReserveBottle,
    };
    // return;
    const create_assignOrderbikeDriver =
      await AssignOrderForBikeDriverModel.create(
        addAssignOderForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignUseraddressForBikedriverAdded,
      data: create_assignOrderbikeDriver,
    });
  },

  getAllListAssignOrderAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignTruckData = await AssignOrderForBikeDriverModel.aggregate([
      {
        $match: {
          $or: [
            { activeStatus: "Active" },
            // { activeStatus: "Completed" },
          ],
        },
      },
      {
        $unwind: "$deliveryZone",
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
      // { $unset: "assignTruckId" },
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
          assignTruckId: "$assignTruckId",
          totalTruckCapacity: "$totalTruckCapacity",
          totalReserveCapacity: "$totalReserveCapacity",
          deliveredReserveBottle: "$deliveredReserveBottle",
          returnedReserveBottle: "$returnedReserveBottle",
          damagedBottle: "$damagedBottle",
          leakageBottle: "$leakageBottle",
          brokenBottle: "$brokenBottle",
          // deliveryZoneDetails:"$deliveryZone.deliveryZoneId",
          deliveryZoneDetails: {
            _id: "$deliveryZone.deliveryZoneId._id",
            zoneName: "$deliveryZone.deliveryZoneId.zoneName",
            country: "$deliveryZone.deliveryZoneId.country",
            zoneStock: "$deliveryZone.zoneStock",
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
          assignTruckId: { $first: "$assignTruckId" },
          totalTruckCapacity: { $first: "$totalTruckCapacity" },
          totalReserveCapacity: { $first: "$totalReserveCapacity" },
          deliveredReserveBottle: { $first: "$deliveredReserveBottle" },
          returnedReserveBottle: { $first: "$returnedReserveBottle" },
          damagedBottle: { $first: "$damagedBottle" },
          leakageBottle: { $first: "$leakageBottle" },
          brokenBottle: { $first: "$brokenBottle" },
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
        global.CONFIGS.api.AssignZoneForAssignTruckNotfound,
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
      message: global.CONFIGS.api.AssignZoneForAssignTruckListAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignTruckData[0].data,
    });
  },




  /** */
  updateAssignOrderForBikeDriver: async (req, res, next) => {
    // console.log(req.body,"........")
    const find_bikeDriver = await BikeDriverModel.findOne({
      _id: req.body.bikeDriverId,
      activeStatus: "1",
    });
    // console.log(find_bikeDriver,"....0");
    if (!find_bikeDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverInactive,
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

    let totalReserveCapacity = req.body.totalReserveCapacity;
    console.log(totalReserveCapacity, "......totalReserveCapacity");
    let damagedBottle = req.body.damagedBottle;
    console.log(damagedBottle, "......damagedBottle");
    let leakageBottle = req.body.leakageBottle;
    console.log(leakageBottle, "......leakageBottle");
    let brokenBottle = req.body.brokenBottle;
    console.log(brokenBottle, "......brokenBottle");
    let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    console.log(returnedReserveBottle, "......returnedReserveBottle");

    const existing_bikeDriver = await AssignOrderForBikeDriverModel.find({
      bikeDriverId: req.body.bikeDriverId,
      activeStatus: "Active",
      //   sort:({_id: 1,})
    });
    for (var i = 0; i < existing_bikeDriver.length; i++) {
    //   console.log(existing_bikeDriver, ".......existing_bikeDriver");
      console.log(i, " = hsdhdgdhghdgdhfbdhf");
      console.log(
        existing_bikeDriver[i].endDateAndTime,
        ".......existing_bikeDriver.endDateAndTime"
      );
      console.log(
        existing_bikeDriver[i].startDateAndTime,
        ".......existing_bikeDriver.startDateAndTime"
      );

      let timeDifferenceMillisTwo =
        existing_bikeDriver[i].endDateAndTime - startDateAndTime;
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

    const productOrdered = req.body.productOrder.map(
      (item) => item.productOrderId
    );
    console.log(productOrdered, "....productOrdered");

    const find_productOrder = await ProductOrderModel.find({
      _id: { $in: productOrdered },
      activeStatus: "1",
    });
    console.log(find_productOrder, "......find_productOrder");

    const find_productOrderLength = find_productOrder.length;
    const productOrderIdLength = productOrdered.length;
    console.log(find_productOrderLength, productOrderIdLength);
    if (find_productOrder.length !== productOrdered.length) {
      const err = new customError(
        global.CONFIGS.api.driverAddressInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const addAssignOderForBikeDriver = {
      bikeDriverId: req.body.bikeDriverId,
      productOrder: req.body.productOrder,
      startDateAndTime: req.body.startDateAndTime,
      endDateAndTime: req.body.endDateAndTime,
      totalBottleCapacity: req.body.totalBottleCapacity,
      totalReserveCapacity: req.body.totalReserveCapacity,
      damagedBottle,
      leakageBottle,
      brokenBottle,
      deliveredReserveBottle: deliveredReserveBottle,
      returnedReserveBottle: returnedReserveBottle,
    };
    // return;
    const create_assignOrderbikeDriver =
      await AssignOrderForBikeDriverModel.create(
        addAssignOderForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckadded,
      data: create_assignOrderbikeDriver,
    });
  },
  /** */
};
