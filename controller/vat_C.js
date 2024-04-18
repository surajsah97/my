var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const VatModel = mongoose.model(constants.VatModel);
var customError = require("../middleware/customerror");

module.exports = {
  addVat: async (req, res, next) => {
    var existing_vat = await VatModel.find();
    if (existing_vat.length !== 0) {
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
      const update_vat = await VatModel.updateOne({
        vatPercentage: req.body.vatPercentage,
        activeStatus: req.body.activeStatus,
      });
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.VatUpdated,
        // data: update_vat
      });
    } else {
      var create_vat = await VatModel.create(req.body);
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.Vatadded,
        data: create_vat,
      });
    }
  },

  vatListAdmin: async (req, res, next) => {
    var find_vat = await VatModel.find();
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getVatByAdmin,
      data: find_vat[0],
    });
  },

  vatListFront: async (req, res, next) => {
    var find_vat = await VatModel.find({ activeStatus: "1" }).sort({
      vatPercentage: 1,
    });
    if (find_vat.length == 0) {
      const err = new customError(
        global.CONFIGS.api.VatNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getVatByUser,
      data: find_vat[0],
    });
  },

  vatDelete: async (req, res, next) => {
    const delete_vat = await VatModel.findByIdAndDelete({ _id: req.params.id });
    if (!delete_vat) {
      const err = new customError(
        global.CONFIGS.api.VatNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.VatDelete,
    });
  },
};
