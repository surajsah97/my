const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
// const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);
const customError = require("../middleware/customerror");

module.exports = {
  addzoneName: async (req, res, next) => {
    var find_zoneName = await DeliveryZoneModel.findOne({
      zoneName: req.body.zoneName,
    });
    if (find_zoneName) {
      const err = new customError(
        global.CONFIGS.api.zoneNamealreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    // var find_deliverylocation = await DeliveryLocationModel.findOne({
    //   locations: req.body.locations,
    // });
    // if (find_deliverylocation) {
    //   const err = new customError(
    //     global.CONFIGS.api.locationalreadyadded,
    //     global.CONFIGS.responseCode.alreadyExist
    //   );
    //   return next(err);
    // }
    req.body.location = {
      type: "Point",
      coordinates: [req.body.lat, req.body.long],
    };
    var create_zoneName = await DeliveryZoneModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.zoneNameadded,
      data: create_zoneName,
    });
  },

  updatezoneName: async (req, res, next) => {
    let find_zoneName = await DeliveryZoneModel.findById(req.params.id);
    if (!find_zoneName) {
      const err = new customError(
        global.CONFIGS.api.zoneNameNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const existing_zoneName = await DeliveryZoneModel.findOne({
      zoneName: req.body.zoneName,
      _id: { $nin: [req.params.id] },
    });
    if (existing_zoneName) {
      const err = new customError(
        global.CONFIGS.api.zoneNamealreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["Active", "Inactive"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError(
          "invalid activeStatus Allowed values are: 'Active', 'Inactive'",
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
    find_zoneName = await DeliveryZoneModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.zoneNameUpdated,
      data: find_zoneName,
    });
  },

  zoneNameListBYadmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    var query = {};
    const searchText = req.query.searchText;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (req.query.activeStatus != undefined) {
      query.activeStatus = req.query.activeStatus;
    }
    if (searchText !== undefined) {
      query.$or = [
        { zoneName: { $regex: new RegExp(searchText), $options: "i" } },
      ];
    }
    if (startDate != undefined && endDate != undefined) {
      // console.log({ $gt: new Date(startDate), $lt: new Date(endDate) })
      query.createdAt = {
        $gt: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    if (startDate != undefined && endDate == undefined) {
      // console.log({ $gt: new Date(startDate) })
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (startDate == undefined && endDate != undefined) {
      // console.log({  $lt: new Date(endDate) })
      query.createdAt = { $lte: new Date(endDate) };
    }
    console.log(query);
    var deliveryZoneData = await DeliveryZoneModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          _id: "$_id",
          deliveryZoneName: "$zoneName",
          countryName: "$country",
          location: "$location",
          latitude: "$lat",
          longitude: "$long",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $sort: {
          zoneName: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (deliveryZoneData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.zoneNameNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(
      parseInt(deliveryZoneData[0].metadata[0].total) / limit
    );
    const total = parseInt(deliveryZoneData[0].metadata[0].total);
    console.log(total, "..........");
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getzoneNameSuccess,
      totalData: total,
      totalPage: totalPage,
      allProduct: deliveryZoneData[0].data,
    });
  },

  zoneNameListTruckDriver: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    var deliveryZoneData = await DeliveryZoneModel.aggregate([
      {
        $match: {
          activeStatus: "Active",
        },
      },
      {
        $sort: {
          zoneName: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [
            { $skip: skip },
            { $limit: limit },
            { $project: { createdAt: 0, updatedAt: 0 } },
          ], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (deliveryZoneData[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.zoneNameNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(
      parseInt(deliveryZoneData[0].metadata[0].total) / limit
    );
    const total = parseInt(deliveryZoneData[0].metadata[0].total);
    console.log(total, "..........");
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getzoneNameSuccess,
      totalData: total,
      totalPage: totalPage,
      allProduct: deliveryZoneData[0].data,
    });
  },
};
