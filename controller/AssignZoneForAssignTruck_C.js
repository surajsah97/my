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
    
    const existing_assignTruck = await AssignZoneForAssignTruckModel.findOne({
      assignTruckId: req.body.assignTruckId,
      activeStatus: "Active",sort:({
      _id: 1,
    })
    });
    if (existing_assignTruck) {
    console.log(existing_assignTruck,".......existing_assignTruck");
    console.log(existing_assignTruck.endDateAndTime,".......existing_assignTruck.endDateAndTime");
    console.log(existing_assignTruck.startDateAndTime,".......existing_assignTruck.startDateAndTime");
    
    let timeDifferenceMillisTwo = existing_assignTruck.endDateAndTime - startDateAndTime;
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
 
};
