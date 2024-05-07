var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeBrandModel = mongoose.model(constants.BikeBrandModel);
const BikeModelModel = mongoose.model(constants.BikeModelModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  addmodel: async (req, res, next) => {
    var find_brand = await BikeBrandModel.findOne({
      _id: req.body.bikeBrandId,
      activeStatus: "1",
    });
    if (!find_brand) {
      const err = new customError(
        global.CONFIGS.api.brandInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const modelName = req.body.bikeModel.trim();
    var find_model = await BikeModelModel.findOne({
      bikeModel: { $regex: new RegExp("^" + modelName + "$", "i") },
    });
    console.log(find_model, ".........find_model");
    if (find_model) {
      const err = new customError(
        global.CONFIGS.api.modelalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_model = await BikeModelModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.modeladded,
      data: create_model,
    });
  },

  updateModel: async (req, res, next) => {
    let find_model = await BikeModelModel.findById(req.params.id);
    console.log(find_model, "....find_model");
    if (!find_model) {
      const err = new customError(
        global.CONFIGS.api.modelInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const modelName = req.body.bikeModel.trim();
    const existing_model = await BikeModelModel.findOne({
      // bikeModel: req.body.bikeModel,
      bikeModel: { $regex: new RegExp("^" + modelName + "$", "i") },
      _id: { $nin: [req.params.id] },
    });
    console.log(existing_model,"......existing_model");
    if (existing_model) {
      const err = new customError(
        global.CONFIGS.api.modelalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    if (req.body.bikeBrandId != undefined) {
      let find_brand = await BikeBrandModel.findById(
        new ObjectId(req.body.bikeBrandId)
      );
      if (!find_brand) {
        const err = new customError(
          global.CONFIGS.api.brandInactive,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
    }

    if (req.body.activeStatus != undefined) {
      let validactiveStatus = ["0", "1"];
      if (!validactiveStatus.includes(req.body.activeStatus)) {
        const err = new customError(
          "invalid activeStatus Allowed values are: 0,1",
          global.CONFIGS.responseCode.invalidInput
        );
        return next(err);
      }
    }

    find_model = await BikeModelModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.modelUpdated,
      data: find_model,
    });
  },

  modelListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const skip = (pageNo - 1) * limit;
    const searchText = req.query.searchText;
    const bikeBrandId = req.query.bikeBrandId;
    const activeStatus = req.query.activeStatus;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let query = {};
    if (bikeBrandId != undefined) {
      query.bikeBrandId = new ObjectId(bikeBrandId);
    }
    if (activeStatus != undefined) {
      query.activeStatus = activeStatus;
    }
    if (searchText !== undefined) {
      query.$or = [
        { bikeModel: { $regex: new RegExp(searchText), $options: "i" } },
        {
          "bikebrand.bikeBrand": {
            $regex: new RegExp(searchText),
            $options: "i",
          },
        },
      ];
    }
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
    console.log(query);
    var find_model = await BikeModelModel.aggregate([
      {
        $lookup: {
          from: "bikebrand",
          localField: "bikeBrandId",
          foreignField: "_id",
          as: "bikebrand",
        },
      },
      { $unwind: "$bikebrand" },
      // { $unset: "bikeBrandId" },
      {
        $match: query,
      },
      {
        $sort: {
          bikeModel: 1,
        },
      },
      {
        $project: {
          _id: "$_id",
          bikeBrandName: "$bikebrand.bikeBrand",
          bikeModel: "$bikeModel",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);
    if (find_model[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.modelNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }


    const total = find_model[0].metadata[0].total;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allModelListAdmin,
      totalBikeModel: `${total} no of quantity`,
      data: find_model[0].data,
    });
  },

  singleBikeModelByIdAdmin: async (req, res, next) => {
    const find_model = await BikeModelModel.findById(req.params.id);
    console.log(find_model,"....find_model")
    if (!find_model) {
      const err = new customError(
        global.CONFIGS.api.modelInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getModelSuccess,
      data: find_model,
    });
  },

  modelListFront: async (req, res, next) => {
    var find_model = await BikeModelModel.aggregate([
      {
        $match: { activeStatus: "1" },
      },
      {
        $lookup: {
          from: "bikebrand",
          localField: "bikeBrandId",
          foreignField: "_id",
          as: "bikebrand",
        },
      },
      { $unwind: "$bikebrand" },
      { $unset: "bikeBrandId" },
      {
        $sort: {
          bikeModel: 1,
        },
      },
      {
        $project: {
          _id: "$_id",
          bikeBrandName: "$bikebrand.bikeBrand",
          bikeModel: "$bikeModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [],
        },
      },
    ]);
    const total = find_model[0].metadata[0].total;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getModelSuccess,
      totalBikeModel: `${total} no of quantity`,
      data: find_model[0].data,
    });
  },

  modelDelete: async (req, res, next) => {
    var delete_model = await BikeModelModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!delete_model) {
      const err = new customError(
        global.CONFIGS.api.modelInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.modelDelete,
    });
  },
};
