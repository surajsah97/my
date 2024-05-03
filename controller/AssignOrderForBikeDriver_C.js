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

/** */
  getAllListAssignOrderAdmind: async (req, res, next) => {
      var find_brand = await AssignOrderForBikeDriverModel.find({});
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allBrandListAdmin,
      data: find_brand,
    });
  },
/** */ 
  

  getAllListAssignOrderAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignOrderBiker = await AssignOrderForBikeDriverModel.aggregate([
      {
        $match: {
          $or: [
            { activeStatus: "Active" },
            // { activeStatus: "Completed" },
          ],
        },
      },
      {
        $unwind: "$productOrder",
      },
      {
        $lookup: {
          from: "productorder",
          localField: "productOrder.productOrderId",
          foreignField: "_id",
          as: "productOrder.productOrderId",
        },
      },
      {
        $unwind: {
          path: "$productOrder.productOrderId",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "bikedriverdetails",
          localField: "bikeDriverId",
          foreignField: "_id",
          as: "bikedriverdetails",
        },
      },
      { $unwind: "$bikedriverdetails" },
      // { $unset: "bikeDriverId" },
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikedriverdetails.bikeDetailsId",
          foreignField: "_id",
          as: "bikedriverdetails.bikedetails",
        },
      },
    //   { $unwind: "$bikedriverdetails.bikedetails" },
    //   { $unset: "bikedriverdetails.bikeDetailsId" },
    //   {
    //     $lookup: {
    //       from: "bikebrand",
    //       localField: "bikedriverdetails.bikedetails.bikebrandId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.bikedetails.bikebrandId",
    //     },
    //   },
    //   { $unwind: "$bikedriverdetails.bikedetails.bikebrandId" },

    //   {
    //     $lookup: {
    //       from: "bikemodel",
    //       localField: "bikedriverdetails.bikedetails.bikemodelId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.bikedetails.bikemodelId",
    //     },
    //   },
    //   { $unwind: "$bikedriverdetails.bikedetails.bikemodelId" },
    //   {
    //     $lookup: {
    //       from: "truckdriverdetails",
    //       localField: "bikedriverdetails.truckDriverId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.truckdriverdetails",
    //     },
    //   },
    //   { $unwind: "$bikedriverdetails.truckdriverdetails" },
    //   { $unset: "bikedriverdetails.truckDriverId" },
    //   {
    //     $lookup: {
    //       from: "truckdriverbankdetails",
    //       localField:
    //         "bikedriverdetails.truckdriverdetails.bankDetailsId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.truckdriverdetails.bankDetailsId",
    //     },
    //   },
    //   {
    //     $unwind:
    //       "$bikedriverdetails.truckdriverdetails.bankDetailsId",
    //   },
    //   {
    //     $lookup: {
    //       from: "truckdriveraddress",
    //       localField:
    //         "bikedriverdetails.truckdriverdetails.addressId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.truckdriverdetails.addressId",
    //     },
    //   },
    //   { $unwind: "$bikedriverdetails.truckdriverdetails.addressId" },
    //   {
    //     $lookup: {
    //       from: "truckdriverdoc",
    //       localField: "bikedriverdetails.truckdriverdetails.docId",
    //       foreignField: "_id",
    //       as: "bikedriverdetails.truckdriverdetails.docId",
    //     },
    //   },
    //   { $unwind: "$bikedriverdetails.truckdriverdetails.docId" },
      {
        $project: {
          // _id: 1,
          _id: "$_id",
          bikeDriverId: "$bikeDriverId",
          totalBottleCapacity: "$totalBottleCapacity",
          totalReserveCapacity: "$totalReserveCapacity",
          deliveredReserveBottle: "$deliveredReserveBottle",
          returnedReserveBottle: "$returnedReserveBottle",
          damagedBottle: "$damagedBottle",
          leakageBottle: "$leakageBottle",
          brokenBottle: "$brokenBottle",
          productOrderDetails:"$productOrder.productOrderId",
        //   productOrderDetails: {
        //     _id: "$productOrder.productOrderId._id",
        //     zoneName: "$productOrder.productOrderId.zoneName",
        //     country: "$productOrder.productOrderId.country",
        //     zoneStock: "$productOrder.zoneStock",
        //     activeStatus: "$productOrder.productOrderId.activeStatus",
        //     createdAt: "$productOrder.productOrderId.createdAt",
        //     updatedAt: "$productOrder.productOrderId.updatedAt",
        //   },
        //   startDateAndTime: "$startDateAndTime",
        //   endDateAndTime: "$endDateAndTime",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",

          // // //bikedetails:"$bikedriverdetails.bikedetails",
        //   bikedetails: {
        //     BikeDetailsId: "$bikedriverdetails.bikedetails._id",
        //     ownerName: "$bikedriverdetails.bikedetails.ownerName",
        //     bikebrandName:
        //       "$bikedriverdetails.bikedetails.bikebrandId.bikebrand",
        //     bikemodelName:
        //       "$bikedriverdetails.bikedetails.bikemodelId.bikemodel",
        //     chasisNumber:
        //       "$bikedriverdetails.bikedetails.chasisNumber",
        //     vehicleNumber:
        //       "$bikedriverdetails.bikedetails.vehicleNumber",
        //     registrationZone:
        //       "$bikedriverdetails.bikedetails.registrationZone",
        //     registrationDate:
        //       "$bikedriverdetails.bikedetails.registrationDate",
        //     vehicleColor:
        //       "$bikedriverdetails.bikedetails.vehicleColor",
        //     vehicleYear:
        //       "$bikedriverdetails.bikedetails/vehicleYear",
        //     vehicleAge: "$bikedriverdetails.bikedetails.vehicleAge",
        //     fuelType: "$bikedriverdetails.bikedetails.fuelType",
        //     insuranceValidity:
        //       "$bikedriverdetails.bikedetails.insuranceValidity",
        //     fitnessValidity:
        //       "$bikedriverdetails.bikedetails.fitnessValidity",
        //     mulkiyaValidity:
        //       "$bikedriverdetails.bikedetails.mulkiyaValidity",
        //     mulkiyaDocFrontImg:
        //       "$bikedriverdetails.bikedetails.mulkiyaDocImg.frontImg",
        //     mulkiyaDocBackImg:
        //       "$bikedriverdetails.bikedetails.mulkiyaDocImg.backImg",
        //     vehicleFrontImage:
        //       "$bikedriverdetails.bikedetails.vehicleImage.frontImage",
        //     vehicleBackImage:
        //       "$bikedriverdetails.bikedetails.vehicleImage.backImage",
        //     vehicleLeftImage:
        //       "$bikedriverdetails.bikedetails.vehicleImage.leftImage",
        //     vehicleRightImage:
        //       "$bikedriverdetails.bikedetails.vehicleImage.rightImage",
        //     activeStatus:
        //       "$bikedriverdetails.bikedetails.activeStatus",
        //   },
        //   // // // truckDriverDetails:"$bikedriverdetails.truckdriverdetails",

        //   truckDriverDetails: {
        //     TruckDriverID:
        //       "$bikedriverdetails.truckdriverdetails._id",
        //     Name: "$bikedriverdetails.truckdriverdetails.name",
        //     Email: "$bikedriverdetails.truckdriverdetails.email",
        //     Mobile: "$bikedriverdetails.truckdriverdetails.mobile",
        //     AlterNateMobile:
        //       "$bikedriverdetails.truckdriverdetails.altMobile",
        //     Nationality:
        //       "$bikedriverdetails.truckdriverdetails.nationality",
        //     PassportNumber:
        //       "$bikedriverdetails.truckdriverdetails.passportNumber",
        //     PassportValidity:
        //       "bikedriverdetails.$truckdriverdetails.passportValidity",
        //     VisaNumber:
        //       "$bikedriverdetails.truckdriverdetails.visaNumber",
        //     VisaValidity:
        //       "$bikedriverdetails.truckdriverdetails.visaValidity",
        //     EmiratesId:
        //       "$bikedriverdetails.truckdriverdetails.emiratesId",
        //     EmiratesIdValidity:
        //       "$bikedriverdetails.truckdriverdetails.emiratesIdValidity",
        //     InsuranceComp:
        //       "$bikedriverdetails.truckdriverdetails.InsuranceComp",
        //     InsuranceValidity:
        //       "$bikedriverdetails.truckdriverdetails.insuranceValidity",
        //     LicenseNumber:
        //       "$bikedriverdetails.truckdriverdetails.licenseNumber",
        //     LicenseCity:
        //       "$bikedriverdetails.truckdriverdetails.licenseCity",
        //     LicenseType:
        //       "$bikedriverdetails.truckdriverdetails.licenseType",
        //     LicenseValidity:
        //       "$bikedriverdetails.truckdriverdetails.licenseValidity",
        //     IsVerified:
        //       "$bikedriverdetails.truckdriverdetails.isVerified",
        //     DriverType:
        //       "$bikedriverdetails.truckdriverdetails.driverType",
        //     activeStatus:
        //       "$bikedriverdetails.truckdriverdetails.activeStatus",
        //     // addressId: "$bikedriverdetails.truckdriverdetails.addressId",
        //     truckDriverAddressDetails: {
        //       localAddressHouseNo:
        //         "$bikedriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
        //       localAddressBuildingName:
        //         "$bikedriverdetails.truckdriverdetails.addressId.localAddress.buildingName",
        //       localAddressStreet:
        //         "$bikedriverdetails.truckdriverdetails.addressId.localAddress.houseNo",
        //       localAddressLandmark:
        //         "$bikedriverdetails.truckdriverdetails.addressId.localAddress.street",
        //       homeCountryAddressHouseNo:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.houseNo",
        //       homeCountryAddressBuildingName:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.buildingName",
        //       homeCountryAddressStreet:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.street",
        //       homeCountryAddressLandmark:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.landmark",
        //       homeCountryAddressCity:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.city",
        //       homeCountryAddressState:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.state",
        //       homeCountryAddressPinCode:
        //         "$bikedriverdetails.truckdriverdetails.addressId.homeCountryAddress.pinCode",
        //       emergencyContactName:
        //         "$bikedriverdetails.truckdriverdetails.addressId.emergencyContact.name",
        //       emergencyContactRelation:
        //         "$bikedriverdetails.truckdriverdetails.addressId.emergencyContact.relation",
        //       emergencyContactMobile:
        //         "$bikedriverdetails.truckdriverdetails.addressId.emergencyContact.mobile",
        //     },
        //     // // //truckDriverBankDetails:"$bikedriverdetails.truckdriverdetails.bankDetailsId",
        //     truckDriverBankDetails: {
        //       bankName:
        //         "$bikedriverdetails.truckdriverdetails.bankDetailsId.bankName",
        //       accountNumber:
        //         "$bikedriverdetails.truckdriverdetails.bankDetailsId.accountNumber",
        //       accountHolderName:
        //         "$bikedriverdetails.truckdriverdetails.bankDetailsId.accountHolderName",
        //       branchName:
        //         "$bikedriverdetails.truckdriverdetails.bankDetailsId.branchName",
        //       IBAN: "$bikedriverdetails.truckdriverdetails.bankDetailsId.IBAN",
        //     },
        //     // docId: "$bikedriverdetails.truckdriverdetails.docId",
        //     truckDriverDocumentDetails: {
        //       passportFrontImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.passportImg.frontImg",
        //       passportBackImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.passportImg.backImg",
        //       emiratesIdFrontImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.emiratesIdImg.frontImg",
        //       emiratesIdBackImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.emiratesIdImg.backImg",
        //       licenseFrontImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.licenseImg.frontImg",
        //       licenseBackImage:
        //         "$bikedriverdetails.truckdriverdetails.docId.licenseImg.backImg",
        //       visaImg:
        //         "$bikedriverdetails.truckdriverdetails.docId.visaImg",
        //       driverImg:
        //         "$bikedriverdetails.truckdriverdetails.docId.driverImg",
        //     },
        //   },
        },
      },
      {
        $group: {
          _id: "$_id",
          bikeDriverId: { $first: "$bikeDriverId" },
          totalBottleCapacity: { $first: "$totalBottleCapacity" },
          totalReserveCapacity: { $first: "$totalReserveCapacity" },
          deliveredReserveBottle: { $first: "$deliveredReserveBottle" },
          returnedReserveBottle: { $first: "$returnedReserveBottle" },
          damagedBottle: { $first: "$damagedBottle" },
          leakageBottle: { $first: "$leakageBottle" },
          brokenBottle: { $first: "$brokenBottle" },
          orderDetails: {
            $addToSet: "$productOrderDetails",
          },
        //   startDateAndTime: { $first: "$startDateAndTime" },
        //   endDateAndTime: { $first: "$endDateAndTime" },
          activeStatus: { $first: "$activeStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        //   bikedetails: { $first: "$bikedetails" },
        //   truckDriverDetails: { $first: "$truckDriverDetails" },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (assignOrderBiker[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.AssignZoneForAssignTruckNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(assignOrderBiker[0].metadata[0].total);
    var totalPage = Math.ceil(
      parseInt(assignOrderBiker[0].metadata[0].total) / limit
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckListAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignOrderBiker[0].data,
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
