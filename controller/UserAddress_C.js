var mongoose = require("mongoose");
const constants = require("../models/modelConstants");;
const common = require("../service/commonFunction");
const UserAddressModel = mongoose.model(constants.UserAddressModel);
var customError = require('../middleware/customerror');
const NodeGeocoder = require('node-geocoder');

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
        var createAddress = await UserAddressModel.updateOne({_id:req.params.id},req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.registerSuccess,
            // data: createAddress,
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