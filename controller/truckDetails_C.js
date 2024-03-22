var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckModel = mongoose.model(constants.TruckModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');

module.exports = {
    addVehicle: async (req, res, next) => {
        console.log(req.files)
        var mulkiyaDocImg = {};
        var vehicleImage = {}

        if(req.files.mulkiyaImgFront && req.files.mulkiyaImgBack && req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight && req.body.truckBrandId &&
      req.body.truckModelId &&
      req.body.ownerName &&
      req.body.vehicleNumber &&
      req.body.registrationZone &&
      req.body.vehicleColor &&
      req.body.registrationDate &&
      req.body.vehicleYear &&
      req.body.fuelType &&
      req.body.vehicleAge &&
      req.body.chasisNumber &&
      req.body.insuranceValidity &&
      req.body.fitnessValidity &&
      req.body.mulkiyaValidity 
    ){
        mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`
        mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`
            req.body.mulkiyaDocImg = mulkiyaDocImg;

        vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`
        vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`
        vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`
        vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`
        req.body.vehicleImage = vehicleImage;
    }

        var find_vehicle = await TruckModel.findOne({ chasisNumber: req.body.chasisNumber });
        if (find_vehicle) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_vehicle = await TruckModel.create(req.body);
        console.log(create_vehicle,"dgfdf = hvvhh =========")
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            data: create_vehicle
        })
    },

    /** */
//     addVehicle: async (req, res, next) => {
//         console.log(req.files)
//         var mulkiyaDocImg = {};
//         var vehicleImage = {}

//         if(req.files.mulkiyaImgFront && req.files.mulkiyaImgBack && req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight && req.body.truckBrandId &&
//       req.body.truckModelId &&
//       req.body.ownerName &&
//       req.body.vehicleNumber &&
//       req.body.registrationZone &&
//       req.body.vehicleColor &&
//       req.body.registrationDate &&
//       req.body.vehicleYear &&
//       req.body.fuelType &&
//       req.body.vehicleAge &&
//       req.body.chasisNumber &&
//       req.body.insuranceValidity &&
//       req.body.fitnessValidity &&
//       req.body.mulkiyaValidity 
//     ){
//         mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`
//         mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`
//             req.body.mulkiyaDocImg = mulkiyaDocImg;

//         vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`
//         vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`
//         vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`
//         vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`
//         req.body.vehicleImage = vehicleImage;
//     }

// /** */
//         // if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
//         //     mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`
//         //     mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`
//         //     req.body.mulkiyaDocImg = mulkiyaDocImg;
//         // }
//         // if (req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight) {
//         //     vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`
//         //     vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`
//         //     vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`
//         //     vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`
//         //     req.body.vehicleImage = vehicleImage;
//         // }
//         /** */
//         var find_vehicle = await TruckModel.findOne({ chasisNumber: req.body.chasisNumber });
//         if (find_vehicle) {
//             const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
//             return next(err);
//         }
//         var create_vehicle = await TruckModel.create(req.body);
//         console.log(create_vehicle,"dgfdf = hvvhh =========")
//         return res.status(global.CONFIGS.responseCode.success).json({
//             success: true,
//             message: global.CONFIGS.api.Productadded,
//             data: create_vehicle
//         })
//     },
/** */
    updateVehicle: async (req, res, next) => {
        var mulkiyaDocImg = {};
        var vehicleImage = {}
        if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
            mulkiyaDocImg.frontImg = `uploads/truck/${req.files.mulkiyaImgFront[0].filename}`
            mulkiyaDocImg.backImg = `uploads/truck/${req.files.mulkiyaImgBack[0].filename}`
            req.body.mulkiyaDocImg = mulkiyaDocImg;
            return res.send(req.body)
        }
        if (req.files.vehicleImgFront && req.files.vehicleImgBack && req.files.vehicleImgLeft && req.files.vehicleImgRight) {
            vehicleImage.frontImage = `uploads/truck/${req.files.vehicleImgFront[0].filename}`
            vehicleImage.backImage = `uploads/truck/${req.files.vehicleImgBack[0].filename}`
            vehicleImage.leftImage = `uploads/truck/${req.files.vehicleImgLeft[0].filename}`
            vehicleImage.rightImage = `uploads/truck/${req.files.vehicleImgRight[0].filename}`
            req.body.vehicleImage = vehicleImage;
            return res.send(req.body)
        }
        var find_vehicle = await TruckModel.findOne({ chasisNumber: req.body.chasisNumber, _id: { $nin: [req.params.id] } });
        if (find_vehicle) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            next(err);
        }
        var update_vehicle = await TruckModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.ProductUpdated,
        })
    },

    deletevehicle: async (req, res, next) => {
        var delete_vehicle = await TruckModel.deleteOne({ _id: req.params.id });
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

        var truckData = await TruckModel.aggregate([
            {
                $match: { activeStatus: "1" }
            },
            {
                $lookup:
                {
                    from: "truckbrand",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "truckbrand"
                }
            },
            { $unwind: '$truckbrand' },
            { $unset: 'brandId' },
            {
                $lookup:
                {
                    from: "truckmodel",
                    localField: "modelId",
                    foreignField: "_id",
                    as: "truckmodel"
                }
            },
            { $unwind: '$truckmodel' },
            { $unset: 'modelId' },
            { $project: { _id: "$_id", ownerName: "$ownerName", vehicleNumber: "$vehicleNumber", registrationZone: "$registrationZone", registrationDate: "$registrationDate", vehicleColor: "$vehicleColor", vehicleYear: "$vehicleYear", vehicleAge: "$vehicleAge", chasisNumber: "$chasisNumber", insuranceValidity: "$insuranceValidity", fitnessValidity: "$fitnessValidity", mulkiyaValidity: "$mulkiyaValidity", mulkiyaDocImg: "$mulkiyaDocImg", vehicleImage: "$vehicleImage", fuelType: "$fuelType", activeStatus: "$activeStatus", truckBrand: "$truckbrand.truckBrand", truckModel: "$truckmodel.truckModel" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (truckData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFound);
            next(err);
        }
        var totalPage = Math.ceil(parseInt(truckData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: truckData[0].data
        })
    },

    vehicleListAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;
        var truckData = await TruckModel.aggregate([

            {
                $lookup:
                {
                    from: "truckbrand",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "truckbrand"
                }
            },
            { $unwind: '$truckbrand' },
            { $unset: 'brandId' },
            {
                $lookup:
                {
                    from: "truckmodel",
                    localField: "modelId",
                    foreignField: "_id",
                    as: "truckmodel"
                }
            },
            { $unwind: '$truckmodel' },
            { $unset: 'modelId' },
            { $project: { _id: "$_id", ownerName: "$ownerName", vehicleNumber: "$vehicleNumber", registrationZone: "$registrationZone", registrationDate: "$registrationDate", vehicleColor: "$vehicleColor", vehicleYear: "$vehicleYear", vehicleAge: "$vehicleAge", chasisNumber: "$chasisNumber", insuranceValidity: "$insuranceValidity", fitnessValidity: "$fitnessValidity", mulkiyaValidity: "$mulkiyaValidity", mulkiyaDocImg: "$mulkiyaDocImg", vehicleImage: "$vehicleImage", fuelType:"$fuelType", activeStatus: "$activeStatus", truckBrand: "$truckbrand.truckBrand", truckModel: "$truckmodel.truckModel" } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        if (truckData[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.ProductNotfound, global.CONFIGS.responseCode.notFound);
            next(err);
        }
        var totalPage = Math.ceil(parseInt(truckData[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getProductSuccess,
            totalPage: totalPage,
            allOrder: truckData[0].data
        })
    },
}