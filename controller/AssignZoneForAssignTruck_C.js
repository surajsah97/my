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
  addAssignZoneOld: async (req, res, next) => {
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

    const deliveryZoneId = req.body.deliveryZone.map(
      (item) => item.deliveryZoneId
    );
    console.log(deliveryZoneId, "....deliveryZoneId");

    const find_deliveryZone = await DeliveryZoneModel.find({
      _id: { $in: deliveryZoneId },
      activeStatus: "Active",
    });
    console.log(find_deliveryZone, "......find_deliveryZone");

    const find_deliveryZoneLength = find_deliveryZone.length;
    const deliveryZoneIdLength = deliveryZoneId.length;
    console.log(find_deliveryZoneLength, deliveryZoneIdLength);
    if (find_deliveryZone.length !== deliveryZoneId.length) {
      const err = new customError(
        global.CONFIGS.api.zoneNameNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    let startDateAndTime = new Date(req.body.startDateAndTime);
    let endDateAndTime = new Date(req.body.endDateAndTime);

    // Calculate the time difference in milliseconds
    let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));

    console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");
    const addAssignZoneForAssignTruck = {
      assignTruckId: req.body.assignTruckId,
      deliveryZone: req.body.deliveryZone,
      startDateAndTime: req.body.startDateAndTime,
      endDateAndTime: req.body.endDateAndTime,
      timeDifferenceMinutes,
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
    // const deliveryZoneBody = req.body.deliveryZone;
    // console.log(deliveryZoneBody, "....deliveryZoneBody");
    const deliveryZones = req.body.deliveryZone.map(
      (item) => item.deliveryZoneId
    );
    console.log(deliveryZones,".......deliveryZones");
    const existing_deliveryZone = await AssignZoneForAssignTruckModel.find({
      deliveryZoneId : req.body[{ $in: deliveryZones }],
      activeStatus: "Active",
    });
    console.log(existing_deliveryZone,".......existing_deliveryZone");
    if (existing_deliveryZone) {
      const err = new customError(
        global.CONFIGS.api.zoneNamealreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    // console.log(deliveryZoneId, "....deliveryZoneId");
    let sDate = req.body.deliveryZone.map((item) => item.startDateAndTime);
    // console.log(sDate, "....sDate");
    let eDate = req.body.deliveryZone.map((item) => item.endDateAndTime);
    // console.log(eDate, ".......eDate");
    let startDateAndTime = sDate.map((dateString) => new Date(dateString));
    let endDateAndTime = eDate.map((dateString) => new Date(dateString));

    // console.log(startDateAndTime, "......startDateAndTime");
    // console.log(endDateAndTime, "......endDateAndTime");
    let timeDifferenceMinutes = [];
    for (let i = 0; i < startDateAndTime.length; i++) {
      let timeDifferenceMillis = endDateAndTime[i] - startDateAndTime[i];
      let timeDifferenceMinutesSingle = Math.floor(
        timeDifferenceMillis / (1000 * 60)
      );
      timeDifferenceMinutes.push(timeDifferenceMinutesSingle);
    }
    // console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");
    // Add timeDifferenceMinutes to each delivery zone in body
    req.body.deliveryZone.forEach((item, index) => {
        item.timeDifferenceMinutes = timeDifferenceMinutes[index];
    });
    // return;
    const find_deliveryZone = await DeliveryZoneModel.find({
      _id: { $in: deliveryZones },
      activeStatus: "Active",
    });

    // console.log(find_deliveryZone, "......find_deliveryZone");

    const find_deliveryZoneLength = find_deliveryZone.length;
    const deliveryZoneIdLength = deliveryZones.length;
    console.log(`find_deliveryZoneLength=${find_deliveryZoneLength}, deliveryZoneIdLength=${deliveryZoneIdLength}`);
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
    };

    const create_assignZone = await AssignZoneForAssignTruckModel.create(
      addAssignZoneForAssignTruck
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckadded,
      data: create_assignZone,
    });
  },
};
