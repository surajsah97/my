var mongoose = require("mongoose");
const constants = require("../models/modelConstants");;
const common = require("../service/commonFunction");
const UserAddressModel = mongoose.model(constants.UserAddressModel);
var customError = require('../middleware/customerror');
const NodeGeocoder = require('node-geocoder');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    provider: 'google',

    // Optional depending on the providers
    // fetch: customFetchImplementation,
    apiKey: process.env.GOOGLEMAPAPIKEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = {

    googlemap: async (req, res, next) => {
        const data = await geocoder.reverse({ lat: 24.4539, lon: 54.3773 });
        if (data) {
            const data1 = await geocoder.geocode("F93G+HW4 - Al Manhal - Abu Dhabi - United Arab Emirates");
            return res.status(200).json({ data, data1 });
        }
        
        
    },

    addAddress: async (req, res, next) => {
        var find_address = await UserAddressModel.findOne({ userId: req.body.userId });
        if (find_address) {
            const err = new customError(global.CONFIGS.api.registerFail, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        req.body.location = {
            "type": "Point",
            "coordinates": [req.body.long, req.body.lat]
        };
        var createAddress = await UserAddressModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.registerSuccess,
            data: createAddress,
        })
    },

    updateAddress: async (req, res, next) => {
        var find_address = await UserAddressModel.findOne({ _id: req.params.id });
        if (!find_address) {
            const err = new customError(global.CONFIGS.api.registerFail, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        req.body.location = {
            "type": "Point",
            "coordinates": [req.body.long, req.body.lat]
        };
        var createAddress = await UserAddressModel.updateOne({_id:req.params.id},req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.registerSuccess,
            // data: createAddress,
        })
    },
    getAddress: async (req, res, next) => {
        // console.log(req.body);
        var find_user = await UserAddressModel.aggregate([
            {
                $match: { activeStatus: "1", userId: new ObjectId(req.query.userId) }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },
            { $unwind: '$users' },
            { $unset: 'userId' },
            { $project: { _id: "$_id", houseNo: "$houseNo", buildingName: "$buildingName", city: "$city", landmark: "$landmark", country: "$country", activeStatus: "$activeStatus", location: "$location", lat: "$lat", long: "$long", name: "$users.name", mobile: "$users.mobile" } },
            {
                $sort: {
                    _id: -1
                }
            },
        ]);
        // return res.send(find_user)
        if (find_user.length == 0) {
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        // var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getUserDetailsSuccess,
            // totalPage: totalPage,
            data: find_user
        })


    },
    deleteaddress: async (req, res, next) => {
        var find_address = await UserAddressModel.findOne({ _id: req.params.id });
        if (!find_address) {
            const err = new customError(global.CONFIGS.api.registerFail, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var createAddress = await UserAddressModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.registerSuccess,
            // data: createAddress,
        })
    }


}