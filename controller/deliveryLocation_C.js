var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;

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

    const locationNames = req.body.locationName.trim();
    var find_location = await DeliveryLocationModel.findOne({
      locationName: { $regex: new RegExp("^" + locationNames + "$", "i") },
    });
    console.log(find_location,"..");
    if (find_location) {
      const err = new customError(
        global.CONFIGS.api.deliveryLocationAlreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    req.body.location = {
      type: "Point",
      coordinates: [req.body.lat, req.body.long],
    };
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
    // const locationNames=req.body.locationName.trim();
    const locationNames=req.body.locationName ? req.body.locationName.trim() : undefined;
    // const locationRegex = new RegExp('^\\s*' + req.body.locationName.replace(/\s/g, '\\s*') + '\\s*$', 'i');
    const existing_deliveryLocation = await DeliveryLocationModel.findOne({
      // locationName: locationRegex,
      locationName: { $regex: new RegExp("^" + locationNames + "$", "i") },
      // locationName: req.body.locationName,
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
    if (req.body.lat != undefined && req.body.long != undefined) {
      req.body.location = {
        type: "Point",
        coordinates: [req.body.lat, req.body.long],
      };
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

  locationListAdminOld: async (req, res, next) => {
    var find_location = await DeliveryLocationModel.find(
      {},
      // { location: 1,deliveryZoneId:1, _id: 1 }
    ).sort({ location: 1 });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getDeliveryLocationSuccess,
      data: find_location,
    });
  },
  locationListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const skip = (pageNo - 1) * limit;
    const searchText = req.query.searchText;
    const deliveryZoneId=req.query.deliveryZoneId;
    const activeStatus = req.query.activeStatus;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let query = {};
    if (deliveryZoneId != undefined) {
      query.deliveryZoneId = new ObjectId(deliveryZoneId);
    }
    if (activeStatus != undefined) {
      query.activeStatus = activeStatus;
    };
    if (searchText !== undefined) {
      query.$or = [
        { locationName: { $regex: new RegExp(searchText), $options: "i" } },
        { "deliveryzone.zoneName": { $regex: new RegExp(searchText), $options: "i" } },
      ];
    };
    if (startDate != undefined && endDate != undefined) {
      query.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    if (startDate != undefined && endDate == undefined) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (startDate == undefined && endDate != undefined) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    console.log(query,"...query");
    const find_location = await DeliveryLocationModel.aggregate([
      {
        $lookup: {
          from: "deliveryzone",
          localField: "deliveryZoneId",
          foreignField: "_id",
          as: "deliveryzone",
        },
      },
      { $unwind: "$deliveryzone" },
       {
        $match: query,
      },
      {
        $project: {
          _id: "$_id",
          deliveryLocationName: "$locationName",
          deliveryZoneName: "$deliveryzone.zoneName",
          deliveryZoneId: "$deliveryzone._id",
          location: "$location",
          latitude: "$lat",
          longitude: "$long",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
   if (find_location[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.deliveryLocationNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(find_location[0].metadata[0].total) / limit);
    const total = parseInt(find_location[0].metadata[0].total);
     
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getDeliveryLocationSuccess,
      totalData: total,
      totalPage: totalPage,
      data: find_location[0].data,
    });
  },

  locationListFront: async (req, res, next) => {
    var find_location = await DeliveryLocationModel.find({
      activeStatus: "Active",
    }).sort({ locationName: 1 });
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
