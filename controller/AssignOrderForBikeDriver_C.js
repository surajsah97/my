const mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const AssignOrderForBikeDriverModel = mongoose.model(
  constants.AssignOrderForBikeDriverModel
);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const ProductOrderModel = mongoose.model(constants.ProductOrderModel);
const customError = require("../middleware/customerror");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  addAssignOrderForBikeDriver: async (req, res, next) => {
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

    let startDateAndTime = new Date(req.body.startDateAndTime);
    let endDateAndTime = new Date(req.body.endDateAndTime);
    console.log(startDateAndTime, ".....startDateAndTime");
    console.log(endDateAndTime, ".....endDateAndTime");
    // Calculate the time difference in milliseconds
    let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");

    if (timeDifferenceMinutes <= 0) {
      const err = new customError(
        global.CONFIGS.api.EnterEndDateGreaterThanStartDate,
        global.CONFIGS.responseCode.exception
      );
      return next(err);
    }
    /**Oldstart */
    // let totalBottleCapacity = req.body.totalBottleCapacity;
    // console.log(totalBottleCapacity, "......totalBottleCapacity");
    /**Old End */
    let totalReserveCapacity = req.body.totalReserveCapacity;
    console.log(totalReserveCapacity, "......totalReserveCapacity");
    let damagedBottle = req.body.damagedBottle;
    console.log(damagedBottle, "......damagedBottle");
    let leakageBottle = req.body.leakageBottle;
    console.log(leakageBottle, "......leakageBottle");
    let brokenBottle = req.body.brokenBottle;
    console.log(brokenBottle, "......brokenBottle");
    let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    console.log(returnedReserveBottle, "......returnedReserveBottle");
    /**ForStartTime_EndTime */
    // const existing_bikeDriver = await AssignOrderForBikeDriverModel.find({
    //   bikeDriverId: req.body.bikeDriverId,
    //   activeStatus: "Active",
    //   //   sort:({_id: 1,})
    // });
    // for (var i = 0; i < existing_bikeDriver.length; i++) {
    //   console.log(existing_bikeDriver, ".......existing_bikeDriver");
    //   console.log(i, " = hsdhdgdhghdgdhfbdhf");
    //   console.log(
    //     existing_bikeDriver[i].endDateAndTime,
    //     ".......existing_bikeDriver.endDateAndTime"
    //   );
    //   console.log(
    //     existing_bikeDriver[i].startDateAndTime,
    //     ".......existing_bikeDriver.startDateAndTime"
    //   );

    //   let timeDifferenceMillisTwo =
    //     existing_bikeDriver[i].endDateAndTime - startDateAndTime;
    //   let timeDifferenceMinutesTwo = Math.floor(
    //     timeDifferenceMillisTwo / (1000 * 60)
    //   );
    //   console.log(timeDifferenceMinutesTwo, ".....timeDifferenceMinutesTwo");

    //   if (timeDifferenceMinutesTwo >= 0) {
    //     const err = new customError(
    //       global.CONFIGS.api.EnterStartDateGreaterThanEndDate,
    //       global.CONFIGS.responseCode.exception
    //     );
    //     return next(err);
    //   }
    // }
    /**ForStartTime_Endtime */
    /**Old Start*/
    const productOrdered = req.body.productOrder.map(
      (item) => item.productOrderId
    );
    console.log(productOrdered, "....productOrdered");

    const find_productOrder = await ProductOrderModel.find({
      _id: { $in: productOrdered },
      status: "Pending",
    });
    // console.log(find_productOrder, "......find_productOrder");
    /**Old End */

    /**Old Start_Step1 */
    // const productOrdered = req.body.productOrder;
    // let totalBottleCapacity=0;
    // for (const ordered of productOrdered) {
    //     totalBottleCapacity += parseInt(ordered.bottleQunatity); // Accumulate bottleQunatity
    // }
    /**Old End */
    // const productOrderIds = req.body.productOrder.map(item => item.productOrderId);
    // console.log(productOrderIds, "....productOrderIds..");
    

    // const find_productOrder = await ProductOrderModel.find({
    //   _id: { $in: productOrderIds },
    //   status: "Pending",
    // });
    // console.log(find_productOrder, "......find_productOrder");
    /** */
    // const productOrderOfproduct = find_productOrder.forEach(order => {
    //     let totalQty = 0;
    //     order.product.forEach(item => {
    //     totalQty += item.qty;
    //     });
    //     return totalQty;
    // });
    /** */
    const productOrderOfproduct = find_productOrder.reduce((accumulator, order) => {
        let totalQty = 0;
        order.product.forEach(item => {
        totalQty += item.qty;
        });
      return accumulator + totalQty;
    }, 0);
    // console.log(productOrderOfproduct, "....productOrderOfproduct..");
// return
    const find_productOrderLength = find_productOrder.length;
    const productOrderIdLength = productOrdered.length;
    console.log(find_productOrderLength, productOrderIdLength);
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
      totalBottleCapacity:productOrderOfproduct,
    //   totalBottleCapacity,
      totalReserveCapacity: req.body.totalReserveCapacity,
      damagedBottle,
      leakageBottle,
      brokenBottle,
      deliveredReserveBottle: deliveredReserveBottle,
      returnedReserveBottle:returnedReserveBottle,
    };
    // return;
    const create_assignOrderbikeDriver =
      await AssignOrderForBikeDriverModel.create(
        addAssignOderForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignUseraddressForBikedriverAdded,
      data: create_assignOrderbikeDriver,
    });
  },
  updateAssignOrderForBikeDriver: async (req, res, next) => {
    // console.log(req.body,"........")
    const find_bikeDriver = await BikeDriverModel.findOne({
      _id: req.body.bikeDriverId,
      activeStatus: "1",
    });
    // console.log(find_bikeDriver,"....0");
    if (!find_bikeDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    let startDateAndTime = new Date(req.body.startDateAndTime);
    let endDateAndTime = new Date(req.body.endDateAndTime);
    console.log(startDateAndTime, ".....startDateAndTime");
    console.log(endDateAndTime, ".....endDateAndTime");
    // Calculate the time difference in milliseconds
    let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");

    if (timeDifferenceMinutes <= 0) {
      const err = new customError(
        global.CONFIGS.api.EnterEndDateGreaterThanStartDate,
        global.CONFIGS.responseCode.exception
      );
      return next(err);
    }

    let totalReserveCapacity = req.body.totalReserveCapacity;
    console.log(totalReserveCapacity, "......totalReserveCapacity");
    let damagedBottle = req.body.damagedBottle;
    console.log(damagedBottle, "......damagedBottle");
    let leakageBottle = req.body.leakageBottle;
    console.log(leakageBottle, "......leakageBottle");
    let brokenBottle = req.body.brokenBottle;
    console.log(brokenBottle, "......brokenBottle");
    let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    console.log(returnedReserveBottle, "......returnedReserveBottle");

    const existing_bikeDriver = await AssignOrderForBikeDriverModel.find({
      bikeDriverId: req.body.bikeDriverId,
      activeStatus: "Active",
      //   sort:({_id: 1,})
    });
    for (var i = 0; i < existing_bikeDriver.length; i++) {
    //   console.log(existing_bikeDriver, ".......existing_bikeDriver");
      console.log(i, " = hsdhdgdhghdgdhfbdhf");
      console.log(
        existing_bikeDriver[i].endDateAndTime,
        ".......existing_bikeDriver.endDateAndTime"
      );
      console.log(
        existing_bikeDriver[i].startDateAndTime,
        ".......existing_bikeDriver.startDateAndTime"
      );

      let timeDifferenceMillisTwo =
        existing_bikeDriver[i].endDateAndTime - startDateAndTime;
      let timeDifferenceMinutesTwo = Math.floor(
        timeDifferenceMillisTwo / (1000 * 60)
      );
      console.log(timeDifferenceMinutesTwo, ".....timeDifferenceMinutesTwo");

      if (timeDifferenceMinutesTwo >= 0) {
        const err = new customError(
          global.CONFIGS.api.EnterStartDateGreaterThanEndDate,
          global.CONFIGS.responseCode.exception
        );
        return next(err);
      }
    }

    const productOrdered = req.body.productOrder.map(
      (item) => item.productOrderId
    );
    console.log(productOrdered, "....productOrdered");

    const find_productOrder = await ProductOrderModel.find({
      _id: { $in: productOrdered },
      activeStatus: "1",
    });
    console.log(find_productOrder, "......find_productOrder");

    const find_productOrderLength = find_productOrder.length;
    const productOrderIdLength = productOrdered.length;
    console.log(find_productOrderLength, productOrderIdLength);
    if (find_productOrder.length !== productOrdered.length) {
      const err = new customError(
        global.CONFIGS.api.driverAddressInactive,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const addAssignOderForBikeDriver = {
      bikeDriverId: req.body.bikeDriverId,
      productOrder: req.body.productOrder,
      startDateAndTime: req.body.startDateAndTime,
      endDateAndTime: req.body.endDateAndTime,
      totalBottleCapacity: req.body.totalBottleCapacity,
      totalReserveCapacity: req.body.totalReserveCapacity,
      damagedBottle,
      leakageBottle,
      brokenBottle,
      deliveredReserveBottle: deliveredReserveBottle,
      returnedReserveBottle: returnedReserveBottle,
    };
    // return;
    const create_assignOrderbikeDriver =
      await AssignOrderForBikeDriverModel.create(
        addAssignOderForBikeDriver
      );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckadded,
      data: create_assignOrderbikeDriver,
    });
  },
};
