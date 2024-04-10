var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TrialUserModel = mongoose.model(constants.TrialUserModel);
var customError = require("../middleware/customerror");
const sendEmail = require("../utills/sendEmail");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

module.exports = {
  addTrailUsers: async (req, res, next) => {
    var find_trialusers = await TrialUserModel.findOne({
      $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
    });
    if (find_trialusers) {
      const err = new customError(
        global.CONFIGS.api.trialusersalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }
    if (
      req.body.source != undefined &&
      (req.body.source == "instagram" || req.body.source == "tiktok")
    ) {
      req.body.source = req.body.source;
    } else {
      delete req.body.source;
    }
    if (req.body.lng != undefined && req.body.lat != undefined) {
      req.body.location = {
        type: "Point",
        coordinates: [req.body.lng, req.body.lat],
      };
    }

    var create_trialusers = await TrialUserModel.create(req.body);

    // if (create_trialusers) {
    //   const user = await TrialUserModel.findOne({ email: req.body.email });
    //   const templatePath = path.join(__dirname, "../views/emailTemplate.ejs");
    //   const emailTemplate = fs.readFileSync(templatePath, 'utf-8');
    //   const renderedHtml = ejs.render(emailTemplate, { userName: user.name });

    //   await sendEmail({
    //     email: user.email,
    //     subject: `Confirmation of Registration for Dhudu Complimentary Milk Sample: Limited Time Only.`,
    //     message: renderedHtml,
    //   });
    // }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.trialusersadded,
      data: create_trialusers,
    });
  },

  trialusersListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;

    var query = {};

    if (req.query.searchText != undefined) {
      query = {
        $or: [
          { name: { $regex: new RegExp(req.query.searchText), $options: "i" } },
          {
            email: { $regex: new RegExp(req.query.searchText), $options: "i" },
          },
          // { mobileNumber: { $eq: parseInt(req.query.searchText) } },
          {
            mobileNumber: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
            // $where:"/^123.*/.test(this.mobileNumber)"
          },
          {
            flatNumber: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            buildingName: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            address: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            landmark: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            emiratesName: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            productType: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            deliveryTime: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
          {
            userType: {
              $regex: new RegExp(req.query.searchText),
              $options: "i",
            },
          },
        ],
      };
    }
    if (req.query.sDate != undefined && req.query.eDate != undefined) {
      // console.log({ $gt: new Date(req.query.sDate), $lt: new Date(req.query.eDate) })
      query.createdAt = {
        $gt: new Date(req.query.sDate),
        $lt: new Date(req.query.eDate),
      };
    }
    if (req.query.sDate != undefined && req.query.eDate == undefined) {
      // console.log({ $gt: new Date(req.query.sDate) })
      query.createdAt = { $gte: new Date(req.query.sDate) };
    }
    if (req.query.sDate == undefined && req.query.eDate != undefined) {
      // console.log({  $lt: new Date(req.query.eDate) })
      query.createdAt = { $lte: new Date(req.query.eDate) };
    }
    // console.log(query)
    var allUser = await TrialUserModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    if (allUser[0].data.length > 0) {
      var totalPage = Math.ceil(parseInt(allUser[0].metadata[0].total) / limit);
      var totalTrialUsers = parseInt(allUser[0].metadata[0].total);
      const dataOnThatPage =
        totalTrialUsers - skip > limit ? limit : totalTrialUsers - skip;
      const totalLeftdata = totalTrialUsers - skip - dataOnThatPage;
      const rangeStart = totalTrialUsers === 0 ? 1 : skip + 1;
      const rangeEnd =
        pageNo === totalPage ? totalTrialUsers : skip + dataOnThatPage;
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.alltrialuserslistAdmin,
        rangers: `Showing ${rangeStart} – ${rangeEnd} of ${totalTrialUsers} totalData`,
        totalTrialUsers,
        totalPage: totalPage,
        totalLeftdata: totalLeftdata,
        dataOnThatPage,
        allUser: allUser[0].data,
      });
    } else {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
  },
};
