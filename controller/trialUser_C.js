var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TrialUserModel = mongoose.model(constants.TrialUserModel);
var customError = require("../middleware/customerror");

module.exports = {
  addTrailUsers: async (req, res, next) => {
    var find_trialusers = await TrialUserModel.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (find_trialusers) {
      const err = new customError(
        global.CONFIGS.api.trialusersalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    req.body.location = {
      type: "Point",
      coordinates: [req.body.lng, req.body.lat],
    };
    var create_trialusers = await TrialUserModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.trialusersadded,
      data: create_trialusers,
    });
  },

  // updateBrand: async (req, res, next) => {
  //     var find_brand = await TrialUserModel.findOne({ bikeBrand: req.body.bikeBrand, _id: { $nin: [req.params.id] } });
  //     if (find_brand) {
  //         const err = new customError(global.CONFIGS.api.brandalreadyadded, global.CONFIGS.responseCode.alreadyExist);
  //         return next(err);
  //     }
  //     var update_brand = await TrialUserModel.updateOne({ _id: req.params.id }, req.body);
  //     return res.status(global.CONFIGS.responseCode.success).json({
  //         success: true,
  //         message: global.CONFIGS.api.brandUpdated,
  //     })
  // },

  trialusersListAdmin: async (req, res, next) => {
    var find_trialusers = await TrialUserModel.find().sort({ _id: -1 });
    var totaltrialusers = find_trialusers.length;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      totaltrialusers,
      data: find_trialusers,
    });
  },

  trialusersListAdminBYdate: async (req, res, next) => {
    const date = new Date(req.params.date);
    /**this gives greater and equal to given date */
    var find_trialusersByDate = await TrialUserModel.find({
      createdAt: { $gte: date },
    });

    //     /**this gives date only givendate */
    // var find_trialusersByDate = await TrialUserModel.find({ createdAt: { $gte: date, $lt: new Date(date.getTime() + 86400000) } });

    var totaltrialusersbyDate = find_trialusersByDate.length;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      totaltrialusersbyDate,
      find_trialusersByDate,
    });
  },

};
