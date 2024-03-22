var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckBrandModel = mongoose.model(constants.TruckBrandModel);
const TruckModelModel = mongoose.model(constants.TruckModelModel);
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    addmodel: async (req, res, next) => {
        var find_brand = await TruckBrandModel.findOne({ _id: req.body.truckBrandId, activeStatus: "1" });
        if (!find_brand) {
            const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.alreadyExist);
           return next(err);
        }
        var find_model = await TruckModelModel.findOne({ truckModel: req.body.truckModel });
        if (find_model) {
            const err = new customError(global.CONFIGS.api.modelalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        var create_model = await TruckModelModel.create(req.body);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modeladded,
            data: create_model
        })
    },

    updateModel: async (req, res, next) => {
        let find_model = await TruckModelModel.findById(req.params.id);
        console.log(find_model,"....find_model")
        if (!find_model) {
        const err = new customError(global.CONFIGS.api.modelInactive, global.CONFIGS.responseCode.notFound);
        return next(err);
        }
        const existing_model = await TruckModelModel.findOne({ truckModel: req.body.truckModel, _id: { $nin: [req.params.id] } });
        if (existing_model) {
            const err = new customError(global.CONFIGS.api.modelalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }

        if(req.body.truckBrandId!=undefined){
            let find_brand = await TruckBrandModel.findById(new ObjectId(req.body.truckBrandId));
            if (!find_brand) {
            const err = new customError(global.CONFIGS.api.brandInactive, global.CONFIGS.responseCode.notFound);
            return next(err);
            }
        }
        
        if(req.body.activeStatus!=undefined){
            let validactiveStatus = ["0","1"];
            if (!validactiveStatus.includes(req.body.activeStatus)) {
            const err = new customError("invalid activeStatus Allowed values are: 0,1", global.CONFIGS.responseCode.invalidInput);
            return next(err);
            }
        }

        find_model = await TruckModelModel.findByIdAndUpdate( req.params.id , req.body,{new:true});
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modelUpdated,
            data:find_model
        })
    },

    modelListAdmin: async (req, res, next) => {
        var find_model = await TruckModelModel.aggregate([
            {
                $lookup:{
                    from:"truckbrand",
                    localField:"truckBrandId",
                    foreignField:"_id",
                    as:"truckbrand"
                }
            },
            { $unwind: "$truckbrand" },
            { $unset: "truckBrandId" },
            {
                $sort:{
                    truckModel:1
                }
            },
            {
                $project:{
                    _id:"$_id",
                    truckBrandName:"$truckbrand.truckBrand",
                    truckModel:"$truckModel",
                    activeStatus:"$activeStatus",
                    createdAt:"$createdAt",
                    updatedAt:"$updatedAt",
                }
            },
            {
                $facet: {
                metadata: [{ $count: "total" },],
                data: [], 
                },
            },
        ]);
        const total=find_model[0].metadata[0].total
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getModelSuccess,
            totaltruckModel:`${total} no of quantity` ,
            data: find_model[0].data,
        });
    },
    modelListFront: async (req, res, next) => {
        var find_model = await TruckModelModel.aggregate([
            {
                $match: { activeStatus: "1" },
            },
            {
                $lookup:{
                    from:"truckbrand",
                    localField:"truckBrandId",
                    foreignField:"_id",
                    as:"truckbrand"
                }
            },
            { $unwind: "$truckbrand" },
            { $unset: "truckBrandId" },
            {
                $sort:{
                    truckModel:1
                }
            },
            {
                $project:{
                    _id:"$_id",
                    truckBrandName:"$truckbrand.truckBrand",
                    truckModel:"$truckModel",
                    activeStatus:"$activeStatus",
                    createdAt:"$createdAt",
                    updatedAt:"$updatedAt",
                }
            },
            {
                $facet: {
                metadata: [{ $count: "total" },],
                data: [], 
                },
            },
        ]);
        const total=find_model[0].metadata[0].total
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getModelSuccess,
            totaltruckModel:`${total} no of quantity` ,
            data: find_model[0].data,
        });
    },

    modelDelete: async (req, res, next) => {
        var delete_model = await TruckModelModel.findByIdAndDelete({ _id: req.params.id });
        if(!delete_model){
            const err = new customError(
          global.CONFIGS.api.modelInactive,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
        }

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.modelDelete,
        })
    },

}