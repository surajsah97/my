const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const AssignBikeDriverForAssigntruckModel = mongoose.model(
    constants.AssignBikeDriverForAssigntruckModel
);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const AssignTruckForDriverModel = mongoose.model(constants.AssignTruckForDriverModel);
const AssignOrderForBikeDriverModel = mongoose.model(
    constants.AssignOrderForBikeDriverModel
);
const customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;
const qrCode = require("qrcode");
const path = require('path');

module.exports={
     addAssignBikedriverForAssignTruck: async (req, res, next) => {
        // console.log(req.body,"........req.body")
        
        const find_deliveryZone = await DeliveryZoneModel.findOne({
            _id: req.body.deliveryZoneId,
            activeStatus: "Active",
        });
        // console.log(find_deliveryZone,"....find_deliveryZone1");
        if (!find_deliveryZone) {
            const err = new customError(
                global.CONFIGS.api.zoneNameInactive,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
        const find_assigntruck = await AssignTruckForDriverModel.findOne({
            _id: req.body.assigntruckId,
            activeStatus: "1",
        });
        console.log(find_assigntruck,"....find_assigntruck");
        if (!find_assigntruck) {
            const err = new customError(
                global.CONFIGS.api.AssignTruckForDriverInactive,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
/**bikeDriverId find start */
        const bikeDrivered = req.body.bikeDriver.map(
            (item) => item.bikeDriverId
        );
        console.log(bikeDrivered, "....bikeDrivered");

        const find_bikeDriver = await BikeDriverModel.find({
            _id: { $in: bikeDrivered },
            activeStatus: "2",
        });
        console.log(find_bikeDriver, "......find_bikeDriver");
        const find_bikeDriverLength = find_bikeDriver.length;
        const bikeDriverIdLength = bikeDrivered.length;
        console.log(find_bikeDriverLength, bikeDriverIdLength);
        if (find_bikeDriverLength !== bikeDriverIdLength) {
            const err = new customError(
                global.CONFIGS.api.DriverNotfound,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
/**bikeDriverId find success */
        // return
         const assignOrderbikeDrivered = req.body.assignOrderbikeDriver.map(
            (item) => item.assignOrderbikeDriverId
        );
        console.log(assignOrderbikeDrivered, "....assignOrderbikeDrivered");

        const find_assignOrderForbikeDriver = await AssignOrderForBikeDriverModel.find({
            _id: { $in: assignOrderbikeDrivered },
            activeStatus: "Active",
        });
        console.log(find_assignOrderForbikeDriver, "......find_assignOrderForbikeDriver");
// return


        const bottleOfassignOrder = find_assignOrderForbikeDriver.reduce((acc, currentValue) => {
           return acc + currentValue.totalBottleCapacity;
        }, 0);
        console.log(bottleOfassignOrder, "....bottleOfassignOrder..");
        /** */
        // return
        const find_assignOrderForbikeDriverLength = find_assignOrderForbikeDriver.length;
        const assignOrderForbikeDriverLength = assignOrderbikeDrivered.length;
        console.log(find_assignOrderForbikeDriverLength,"...find_assignOrderForbikeDriverLength.......");
        console.log( find_assignOrderForbikeDriverLength,"....find_assignOrderForbikeDriverLength......");
        console.log(assignOrderForbikeDriverLength, assignOrderForbikeDriverLength);
        // if ( productOrderOfproduct > 20) {
        //     const err = new customError(
        //         global.CONFIGS.api.totalBottleCapacity,
        //         global.CONFIGS.responseCode.badRequest
        //     );
        //     return next(err);
        // }
        if (find_assignOrderForbikeDriverLength !== assignOrderForbikeDriverLength) {
            const err = new customError(
                global.CONFIGS.api.AssignOrderForBikedriverNotfound,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
        // return
        const addAssignBikedriverForAssignTruck = {
            deliveryZoneId: req.body.deliveryZoneId,
            bikeDriver: req.body.bikeDriver, 
            assigntruckId: req.body.assigntruckId, 
            assignOrderbikeDriver: req.body.assignOrderbikeDriver,
            //   startDateAndTime: req.body.startDateAndTime,
            //   endDateAndTime: req.body.endDateAndTime,
            totalBottleCapacity: bottleOfassignOrder,
            //   totalBottleCapacity,
            totalReserveCapacity: req.body.totalReserveCapacity,
            damagedBottle: req.body.damagedBottle,
            leakageBottle: req.body.leakageBottle,
            brokenBottle: req.body.brokenBottle,
            deliveredReserveBottle: req.body.deliveredReserveBottle,
            returnedReserveBottle: req.body.returnedReserveBottle,
        };
        // return;
        
        const create_assignBikedriverForAssigntruck =
            await AssignBikeDriverForAssigntruckModel.create(
                addAssignBikedriverForAssignTruck
            );
            /** */
            const qrCodePath = `uploads/assignbikedriverqrcode/${create_assignBikedriverForAssigntruck._id}.png`;
            const absoluteQrCodePath = path.join(__dirname, '../public', qrCodePath);
            await qrCode.toFile(absoluteQrCodePath, JSON.stringify(create_assignBikedriverForAssigntruck));
            console.log(absoluteQrCodePath, ".......2");
            create_assignBikedriverForAssigntruck.assignbikedriverQrCode = qrCodePath;
            await create_assignBikedriverForAssigntruck.save();

            if (create_assignBikedriverForAssigntruck) {
            var update_assignTruck = await AssignTruckForDriverModel.updateOne(
                { _id: req.body.assigntruckId },
                { activeStatus: "2" }
            );
            var update_BikeDriver = await BikeDriverModel.updateOne(
                { _id: req.body.bikeDriverId },
                { activeStatus: "3" }
            );
            var update_orderForBikedriver = await AssignOrderForBikeDriverModel.updateMany(
                { _id: { $in: assignOrderbikeDrivered } },
                { activeStatus: "AssignByAdmin" }
            );
            }
            console.log(update_assignTruck,".....update_assignTruck");
            console.log(update_BikeDriver,".....update_BikeDriver");
            console.log(update_orderForBikedriver,".....update_orderForBikedriver");
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.AssignUseraddressForBikedriverAdded,
            data: create_assignBikedriverForAssigntruck,
        });
    },





}