const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const AssignUserAddressForBikeDriverModel = mongoose.model(
  constants.AssignUserAddressForBikeDriverModel
);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const UserAddressModel = mongoose.model(constants.UserAddressModel);
const customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  addAssignUserAddress: async (req, res, next) => {
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
/** */
    // let totalReserveCapacity = req.body.totalReserveCapacity;
    // console.log(totalReserveCapacity, "......totalReserveCapacity");
    // let damagedBottle = req.body.damagedBottle;
    // console.log(damagedBottle, "......damagedBottle");
    // let leakageBottle = req.body.leakageBottle;
    // console.log(leakageBottle, "......leakageBottle");
    // let brokenBottle = req.body.brokenBottle;
    // console.log(brokenBottle, "......brokenBottle");
    // let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    // console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    // let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    // console.log(returnedReserveBottle, "......returnedReserveBottle");
/** */

    const existing_bikeDriver = await AssignUserAddressForBikeDriverModel.find({
      bikeDriverId: req.body.bikeDriverId,
      activeStatus: "Active",
      //   sort:({_id: 1,})
    });
    for (var i = 0; i < existing_bikeDriver.length; i++) {
      console.log(existing_bikeDriver, ".......existing_bikeDriver");
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

    const deliveryAddressed = req.body.deliveryAddress.map(
      (item) => item.deliveryAddressId
    );
    console.log(deliveryAddressed, "....deliveryAddressed");

    const find_deliveryAddress = await UserAddressModel.find({
      _id: { $in: deliveryAddressed },
      activeStatus: "1",
    });
    console.log(find_deliveryAddress, "......find_deliveryAddress");

    const find_deliveryAddressLength = find_deliveryAddress.length;
    const deliveryAddressIdLength = deliveryAddressed.length;
    console.log(find_deliveryAddressLength, deliveryAddressIdLength);
    if (find_deliveryAddress.length !== deliveryAddressed.length) {
      const err = new customError(
        global.CONFIGS.api.driverAddressInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const addAssignUserAddressForBikeDriver = {
      bikeDriverId: req.body.bikeDriverId,
      deliveryAddress: req.body.deliveryAddress,
      startDateAndTime: req.body.startDateAndTime,
      endDateAndTime: req.body.endDateAndTime,
      totalBottleCapacity: req.body.totalBottleCapacity,
      totalReserveCapacity: req.body.totalReserveCapacity,
      damagedBottle:req.body.damagedBottle,
      leakageBottle:req.body.leakageBottle,
      brokenBottle:req.body.brokenBottle,
      deliveredReserveBottle: req.body.deliveredReserveBottle,
      returnedReserveBottle:req.body.returnedReserveBottle,
    };
    // return;
    const create_assignUserAddress =
      await AssignUserAddressForBikeDriverModel.create(
        addAssignUserAddressForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignUseraddressForBikedriverAdded,
      data: create_assignUserAddress,
    });
  },
  updateAssignUserAddress: async (req, res, next) => {
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

    const existing_bikeDriver = await AssignUserAddressForBikeDriverModel.find({
      bikeDriverId: req.body.bikeDriverId,
      activeStatus: "Active",
      //   sort:({_id: 1,})
    });
    for (var i = 0; i < existing_bikeDriver.length; i++) {
      console.log(existing_bikeDriver, ".......existing_bikeDriver");
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

    const deliveryAddressed = req.body.deliveryAddress.map(
      (item) => item.deliveryAddressId
    );
    console.log(deliveryAddressed, "....deliveryAddressed");

    const find_deliveryAddress = await UserAddressModel.find({
      _id: { $in: deliveryAddressed },
      activeStatus: "1",
    });
    console.log(find_deliveryAddress, "......find_deliveryAddress");

    const find_deliveryAddressLength = find_deliveryAddress.length;
    const deliveryAddressIdLength = deliveryAddressed.length;
    console.log(find_deliveryAddressLength, deliveryAddressIdLength);
    if (find_deliveryAddress.length !== deliveryAddressed.length) {
      const err = new customError(
        global.CONFIGS.api.driverAddressInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const addAssignUserAddressForBikeDriver = {
      bikeDriverId: req.body.bikeDriverId,
      deliveryAddress: req.body.deliveryAddress,
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
    const create_assignUserAddress =
      await AssignUserAddressForBikeDriverModel.create(
        addAssignUserAddressForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckadded,
      data: create_assignUserAddress,
    });
  },
};
