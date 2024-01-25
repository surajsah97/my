var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeModel = mongoose.model(constants.BikeModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {
    addVehicle: async (req, res, next) => {
        console.log(req.files)
        var mulkiyaDocImg = {};
        var vehicleImage = {}
        if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
            mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`
            mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`
            req.body.mulkiyaDocImg = mulkiyaDocImg;
            // return res.send(req.body)
        }
        if (req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight) {
            vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`
            vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`
            vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`
            vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`
            req.body.vehicleImage = vehicleImage;
            // return res.send(req.body)
        }
        var find_vehicle = await BikeModel.findOne({ chasisNumber: req.body.chasisNumber });
        if (find_vehicle) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_vehicle = await BikeModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_vehicle
        })
    },

    updateVehicle: async (req, res, next) => {
        var mulkiyaDocImg = {};
        var vehicleImage = {}
        if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
            mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`
            mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`
            req.body.mulkiyaDocImg = mulkiyaDocImg;
            return res.send(req.body)
        }
        if (req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight) {
            vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`
            vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`
            vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`
            vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`
            req.body.vehicleImage = vehicleImage;
            return res.send(req.body)
        }
        var find_vehicle = await BikeModel.findOne({ chasisNumber: req.body.chasisNumber, _id: { $nin: [req.params.id] } });
        if (find_vehicle) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var update_vehicle = await BikeModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.ProductUpdated,
        })
    },

    deletevehicle: async (req, res, next) => {
        var delete_vehicle = await BikeModel.deleteOne({ _id: req.params.id });
        if (delete_vehicle) {
            return res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: global.CONFIGS.api.ProductDelete,
            })
        }
    },

    vehicleListFront: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;

        var bikeData = await BikeModel.aggregate([
            {
                $match: { activeStatus: "1" }
            },
            {
                $lookup:
                {
                    from: "bikebrand",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "bikebrand"
                }
            },
            { $unwind: '$bikebrand' },
            { $unset: 'brandId' },
            {
                $lookup:
                {
                    from: "bikemodel",
                    localField: "modelId",
                    foreignField: "_id",
                    as: "bikemodel"
                }
            },
            { $unwind: '$bikemodel' },
            { $unset: 'modelId' },
            { $project: { _id: "$_id", ownerName: "$ownerName", vehicleNumber: "$vehicleNumber", registrationZone: "$registrationZone", registrationDate: "$registrationDate", vehicleColor: "$vehicleColor", vehicleYear: "$vehicleYear", vehicleAge: "$vehicleAge", chasisNumber: "$chasisNumber", insuranceValidity: "$insuranceValidity", fitnessValidity: "$fitnessValidity", mulkiyaValidity: "$mulkiyaValidity", mulkiyaDocImg: "$mulkiyaDocImg", vehicleImage: "$vehicleImage", activeStatus: "$activeStatus", bikeBrand: "$bikebrand.bikeBrand", bikemodel: "$bikemodel.bikeModel" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (bikeData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        var totalPage = Math.ceil(parseInt(bikeData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: bikeData[0].data
        })
    },

    vehicleListAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;
        var bikeData = await BikeModel.aggregate([
            
            {
                $lookup:
                {
                    from: "bikebrand",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "bikebrand"
                }
            },
            { $unwind: '$bikebrand' },
            { $unset: 'brandId' },
            {
                $lookup:
                {
                    from: "bikemodel",
                    localField: "modelId",
                    foreignField: "_id",
                    as: "bikemodel"
                }
            },
            { $unwind: '$bikemodel' },
            { $unset: 'modelId' },
            { $project: { _id: "$_id", ownerName: "$ownerName", vehicleNumber: "$vehicleNumber", registrationZone: "$registrationZone", registrationDate: "$registrationDate", vehicleColor: "$vehicleColor", vehicleYear: "$vehicleYear", vehicleAge: "$vehicleAge", chasisNumber: "$chasisNumber", insuranceValidity: "$insuranceValidity", fitnessValidity: "$fitnessValidity", mulkiyaValidity: "$mulkiyaValidity", mulkiyaDocImg: "$mulkiyaDocImg", vehicleImage: "$vehicleImage", activeStatus: "$activeStatus", bikeBrand: "$bikebrand.bikeBrand", bikemodel: "$bikemodel.bikeModel" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (bikeData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        var totalPage = Math.ceil(parseInt(bikeData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: bikeData[0].data
        })
    },
}