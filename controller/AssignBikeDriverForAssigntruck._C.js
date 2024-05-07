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
        const find_bikeDriver = await BikeDriverModel.findOne({
            _id: req.body.bikeDriverId,
            activeStatus: "1",
        });
        // console.log(find_bikeDriver,"....find_bikeDriver");
        if (!find_bikeDriver) {
            const err = new customError(
                global.CONFIGS.api.DriverInactive,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
         const productOrdered = req.body.productOrder.map(
            (item) => item.productOrderId
        );
        console.log(productOrdered, "....productOrdered");

        const find_productOrder = await ProductOrderModel.find({
            _id: { $in: productOrdered },
            status: "Pending",
        });
        console.log(find_productOrder, "......find_productOrder");

        const productOrderOfproduct = find_productOrder.reduce((accumulator, order) => {
            let totalQty = 0;

            order.product.forEach(item => {
                totalQty += item.qty;
            });
            return accumulator + totalQty;
        }, 0);
        console.log(productOrderOfproduct, "....productOrderOfproduct..");
        // return
        const find_productOrderLength = find_productOrder.length;
        const productOrderIdLength = productOrdered.length;
        console.log(find_productOrderLength, productOrderIdLength);
        if ( productOrderOfproduct > 20) {
            const err = new customError(
                global.CONFIGS.api.totalBottleCapacity,
                global.CONFIGS.responseCode.badRequest
            );
            return next(err);
        }
        if (find_productOrder.length !== productOrdered.length) {
            const err = new customError(
                global.CONFIGS.api.OrderNotfound,
                global.CONFIGS.responseCode.notFound
            );
            return next(err);
        }
        const addAssignOderForBikeDriver = {
            deliveryZoneId: req.body.deliveryZoneId,
            bikeDriverId: req.body.bikeDriverId,
            productOrder: req.body.productOrder,
            //   startDateAndTime: req.body.startDateAndTime,
            //   endDateAndTime: req.body.endDateAndTime,
            totalBottleCapacity: productOrderOfproduct,
            //   totalBottleCapacity,
            totalReserveCapacity: req.body.totalReserveCapacity,
            damagedBottle: req.body.damagedBottle,
            leakageBottle: req.body.leakageBottle,
            brokenBottle: req.body.brokenBottle,
            deliveredReserveBottle: req.body.deliveredReserveBottle,
            returnedReserveBottle: req.body.returnedReserveBottle,
        };
        // return;
        
        const create_assignOrderbikeDriver =
            await AssignOrderForBikeDriverModel.create(
                addAssignOderForBikeDriver
            );
            /** */
            const qrCodePath = `uploads/assignorderqrcode/${create_assignOrderbikeDriver._id}.png`;
            const absoluteQrCodePath = path.join(__dirname, '../public', qrCodePath);
            await qrCode.toFile(absoluteQrCodePath, JSON.stringify(create_assignOrderbikeDriver));
            console.log(absoluteQrCodePath, ".......2");
            create_assignOrderbikeDriver.assignorderQrCode = qrCodePath;
            await create_assignOrderbikeDriver.save();

            if (create_assignOrderbikeDriver) {
            var update_BikeDriver = await BikeDriverModel.updateOne(
                { _id: req.body.bikeDriverId },
                { activeStatus: "2" }
            );
            var update_ProductOrder = await ProductOrderModel.updateMany(
                { _id: { $in: productOrdered } },
                { status: "Shipped" }
            );
            }
            console.log(update_BikeDriver,".....update_BikeDriver");
            console.log(update_ProductOrder,".....update_ProductOrder");
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.AssignUseraddressForBikedriverAdded,
            data: create_assignOrderbikeDriver,
        });
    },





}