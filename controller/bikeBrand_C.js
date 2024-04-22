var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeBrandModel = mongoose.model(constants.BikeBrandModel);
var customError = require("../middleware/customerror");

module.exports = {
  addBrand: async (req, res, next) => {
    const brandName = req.body.bikeBrand.trim();
    const find_brand = await BikeBrandModel.findOne({
      bikeBrand: { $regex: new RegExp("^" + brandName + "$", "i") },
    });

    console.log(find_brand, "........");
    if (find_brand) {
      const err = new customError(
        global.CONFIGS.api.brandalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    var create_brand = await BikeBrandModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.brandadded,
      data: create_brand,
    });
  },

  updateBrand: async (req, res, next) => {
    let find_brand = await BikeBrandModel.findById(req.params.id);
    if (!find_brand) {
      const err = new customError(
        global.CONFIGS.api.brandInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const brandName = req.body.bikeBrand.trim();
    const existing_brand = await BikeBrandModel.findOne({
      // bikeBrand: req.body.bikeBrand,
      bikeBrand: { $regex: new RegExp("^" + brandName + "$", "i") },
      _id: { $nin: [req.params.id] },
    });
    console.log(existing_brand, ".....existing_brand");
    if (existing_brand) {
      const err = new customError(
        global.CONFIGS.api.brandalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
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

    find_brand = await BikeBrandModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.brandUpdated,
      data: find_brand,
    });
  },

  brandListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const pageNo = parseInt(req.query.pageNo) || 1;
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
        { bikeBrand: { $regex: new RegExp(searchText), $options: "i" } },
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
    var find_brand = await BikeBrandModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (find_brand[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.brandNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var totalPage = Math.ceil(parseInt(find_brand[0].metadata[0].total) / limit);
    const total = parseInt(find_brand[0].metadata[0].total);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allBrandListAdmin,
      totalData: total,
      totalPage: totalPage,
      allBrand: find_brand[0].data,
    });

  },
  // brandListAdminOld: async (req, res, next) => {
  //   var find_brand = await BikeBrandModel.find({}).sort({ bikeBrand: 1 });
  //   return res.status(global.CONFIGS.responseCode.success).json({
  //     success: true,
  //     message: global.CONFIGS.api.allBrandListAdmin,
  //     data: find_brand,
  //   });
  // },

  singleBrandByIdAdmin: async (req, res, next) => {
    var find_brand = await BikeBrandModel.findById(req.params.id);
    console.log(find_brand, "....find_brand")
    if (!find_brand) {
      const err = new customError(
        global.CONFIGS.api.brandInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getBrandSuccess,
      data: find_brand,
    });
  },


  brandListFront: async (req, res, next) => {
    var find_brand = await BikeBrandModel.find({ activeStatus: "1" }).sort({
      bikeBrand: 1,
    });
    if (find_brand.length == 0) {
      const err = new customError(
        global.CONFIGS.api.brandInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getBrandSuccess,
      data: find_brand,
    });
  },

  brandDelete: async (req, res, next) => {
    const delete_brand = await BikeBrandModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!delete_brand) {
      const err = new customError(
        global.CONFIGS.api.brandInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.brandDelete,
    });
  },
};
