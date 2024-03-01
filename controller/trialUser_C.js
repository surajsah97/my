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

  trialuserListall: async (req, res, next) => {
    var find_trialusers = await TrialUserModel.find().sort({ _id: -1 });
    var totaltrialusers = find_trialusers.length;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      totaltrialusers,
      data: find_trialusers,
    });
  },

  trialusersListAdmin: async (req, res, next) => {

    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
   
      var query = {}

      if (req.query.searchText != undefined) {
        query = {
          $or: [
            { "name": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "email": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "mobileNumber": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "flatNumber": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "buildingName": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "address": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "landmark": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "emiratesName": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "productType": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "deliveryTime": { $regex: new RegExp(req.query.searchText), $options: 'i' } },
            { "userType": { $regex: new RegExp(req.query.searchText), $options: 'i' } }

          ],

        };

      }
      if (req.query.gtDate != undefined && req.query.ltDate != undefined) {
        query.createdAt = { $gt: new Date(req.query.gtDate), $lt: new Date(req.query.ltDate) };
      }
      // console.log(query)
      var allUser = await TrialUserModel.aggregate([
        {
          $match: query
        },
        {
          $sort: {
            _id: -1
          }
        },
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
            data: [{ $skip: skip }, { $limit: limit }]
          }
        }
      ]);

      if (allUser[0].data.length > 0) {
        var totalPage = Math.ceil(parseInt(allUser[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
          success: true,
          message: global.CONFIGS.api.alltrialuserslistAdmin,
          totalPage: totalPage,
          allUser: allUser[0].data
        })
      } else {
        const err = new customError(
          global.CONFIGS.api.userNotFound,
          global.CONFIGS.responseCode.notFound
        );
      }
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.alltrialuserslistAdmin,
      totaltrialusersbyDate,
      find_trialusersByDate,
    });
  },

};
