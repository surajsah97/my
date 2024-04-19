var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
var customError = require("../middleware/customerror");

module.exports = {
  addlocation: async (req, res, next) => {
    var find_deliveryZone = await DeliveryZoneModel.findOne({
      _id: req.body.deliveryZoneId,
      activeStatus: "Active",
    });
    if (!find_deliveryZone) {
      const err = new customError(
        global.CONFIGS.api.zoneNameInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    console.log(find_deliveryZone,"........find_deliveryZone");

    const locationName = req.body.location.trim();
    var find_location = await DeliveryLocationModel.findOne({
      location: { $regex: new RegExp("^" + locationName + "$", "i") },
    });
    console.log(find_location,"..");
    if (find_location) {
      const err = new customError(
        global.CONFIGS.api.deliveryLocationAlreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_location = await DeliveryLocationModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.deliveryLocationAdded,
      data: create_location,
    });
  },

  updatelocation: async (req, res, next) => {
    let find_deliveryLocation = await DeliveryLocationModel.findById(req.params.id,);
    console.log(find_deliveryLocation,"....find_deliveryLocation")
    if (!find_deliveryLocation) {
      const err = new customError(
        global.CONFIGS.api.deliveryLocationNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const locationName=req.body.location.trim();
    // const locationRegex = new RegExp('^\\s*' + req.body.location.replace(/\s/g, '\\s*') + '\\s*$', 'i');
    const existing_deliveryLocation = await DeliveryLocationModel.findOne({
      // location: locationRegex,
      location: { $regex: new RegExp("^" + locationName + "$", "i") },
      // location: req.body.location,
      _id: { $nin: [req.params.id] },
    });
    console.log(existing_deliveryLocation)
    if (existing_deliveryLocation) {
      const err = new customError(
        global.CONFIGS.api.deliveryLocationAlreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    if (req.body.deliveryZoneId != undefined) {
      let find_deliveryZone = await DeliveryZoneModel.findOne({
        _id:req.body.deliveryZoneId,activeStatus:"Active"
        }
      );
      if (!find_deliveryZone) {
        const err = new customError(
          global.CONFIGS.api.zoneNameInactive,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
    }

    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["Active", "Inactive"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError(
          "invalid activeStatus Allowed values are: Active,Inactive",
          global.CONFIGS.responseCode.invalidInput
        );
        return next(err);
      }
    }

    find_deliveryLocation = await DeliveryLocationModel.findByIdAndUpdate(
       req.params.id ,
      req.body,
      {new:true}
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.locationUpdated,
      data:find_deliveryLocation
    });
  },

  locationList: async (req, res, next) => {
    var find_location = await DeliveryLocationModel.find(
      {},
      { location: 1, _id: 0 }
    ).sort({ location: 1 });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getDeliveryLocationSuccess,
      data: find_location,
    });
  },

  locationListFront: async (req, res, next) => {
    var find_location = await DeliveryLocationModel.find({
      activeStatus: "Active",
    }).sort({ location: 1 });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getDeliveryLocationSuccess,
      data: find_location,
    });
  },

  locationDelete: async (req, res, next) => {
    var delete_location = await DeliveryLocationModel.deleteOne({
      _id: req.params.id,
    });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.deliveryLocationDelete,
    });
  },
};
