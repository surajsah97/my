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
    /**ForStartTime_EndTime */
    // let startDateAndTime = new Date(req.body.startDateAndTime);
    // let endDateAndTime = new Date(req.body.endDateAndTime);
    // console.log(startDateAndTime, ".....startDateAndTime");
    // console.log(endDateAndTime, ".....endDateAndTime");
    // // Calculate the time difference in milliseconds
    // let timeDifferenceMillis = endDateAndTime - startDateAndTime;
    // let timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));
    // console.log(timeDifferenceMinutes, ".....timeDifferenceMinutes");

    // if (timeDifferenceMinutes <= 0) {
    //   const err = new customError(
    //     global.CONFIGS.api.EnterEndDateGreaterThanStartDate,
    //     global.CONFIGS.responseCode.exception
    //   );
    //   return next(err);
    // }
     /**ForStartTime_EndTime */
    /**Oldstart */
    // let totalBottleCapacity = req.body.totalBottleCapacity;
    // console.log(totalBottleCapacity, "......totalBottleCapacity");
    /**Old End */
    // let totalReserveCapacity = req.body.totalReserveCapacity;
    // console.log(totalReserveCapacity, "......totalReserveCapacity");
    // let damagedBottle = req.body.damagedBottle;
    // console.log(damagedBottle, "......damagedBottle");
    // let leakageBottle = req.body.leakageBottle;
    // console.log(leakageBottle, "......leakageBottle");
    // let brokenBottle = req.body.brokenBottle;
    // console.log(brokenBottle, "......brokenBottle");
    // let deliveredReserveBottle = damagedBottle + leakageBottle + brokenBottle;
    // console.log(deliveredReserveBottle, "......deliveredReserveBottle");
    // let returnedReserveBottle = totalReserveCapacity - deliveredReserveBottle;
    // console.log(returnedReserveBottle, "......returnedReserveBottle");
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
    console.log(find_productOrder, "......find_productOrder");
    /**Old End */

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
      damagedBottle: req.body.damagedBottle,
      leakageBottle: req.body.leakageBottle,
      brokenBottle: req.body.brokenBottle,
      deliveredReserveBottle: req.body.deliveredReserveBottle,
      returnedReserveBottle:req.body.returnedReserveBottle,
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

/** */
  getAllListAssignOrderAdmind: async (req, res, next) => {
      var find_brand = await AssignOrderForBikeDriverModel.find({});
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.allBrandListAdmin,
      data: find_brand,
    });
  },
/** */ 
  

  getAllListAssignOrderAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    let assignOrderBiker = await AssignOrderForBikeDriverModel.aggregate([
      {
        $match: {
          $or: [
            { activeStatus: "Active" },
            // { activeStatus: "Completed" },
          ],
        },
      },
    //   { $unwind: "$productOrder" },
      {
        $unwind: {
          path: "$productOrder",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "productorder",
          localField: "productOrder.productOrderId",
          foreignField: "_id",
          as: "productOrder.productOrderDetails",
        },
      },
      {
        $unwind: {
          path: "$productOrder.productOrderDetails",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
    //   { $unwind: "$productOrder.productOrderDetails" },
      {
        $lookup: {
          from: "product",
          localField: "productOrder.productOrderDetails.product.productId",
          foreignField: "_id",
          as: "productOrder.productOrderDetails.product.productDetails",
        },
      },
    //   {
    //     $unwind: {
    //       path: "$productOrder.productOrderDetails.product.productDetails",
    //       includeArrayIndex: "string",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   { $unwind: "$productOrder.productOrderDetails.product.productDetails" },
      {
        $lookup: {
          from: "bikedriverdetails",
          localField: "bikeDriverId",
          foreignField: "_id",
          as: "bikedriverdetails",
        },
      },
      { $unwind: "$bikedriverdetails" },
      // { $unset: "bikeDriverId" },
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikedriverdetails.bikeDetailsId",
          foreignField: "_id",
          as: "bikedriverdetails.bikeDetails",
        },
      },
      { $unwind: "$bikedriverdetails.bikeDetails" },
      { $unset: "bikedriverdetails.bikeDetailsId" },
      {
        $lookup: {
          from: "bikebrand",
          localField: "bikedriverdetails.bikeDetails.brandId",
          foreignField: "_id",
          as: "bikedriverdetails.bikeDetails.brandDetails",
        },
      },
      { $unwind: "$bikedriverdetails.bikeDetails.brandDetails" },
      { $unset: "bikedriverdetails.bikeDetails.brandId" },

      {
        $lookup: {
          from: "bikemodel",
          localField: "bikedriverdetails.bikeDetails.modelId",
          foreignField: "_id",
          as: "bikedriverdetails.bikeDetails.modelDetails",
        },
      },
      { $unwind: "$bikedriverdetails.bikeDetails.modelDetails" },
      { $unset: "bikedriverdetails.bikeDetails.modelId" },
      {
        $lookup: {
          from: "driverbankdetails",
          localField:
            "bikedriverdetails.bankDetailsId",
          foreignField: "_id",
          as: "bikedriverdetails.bankDetails",
        },
      },
      {$unwind:"$bikedriverdetails.bankDetails",},
      {$unset:"bikedriverdetails.bankDetailsId",},
      {
        $lookup: {
          from: "driveraddress",
          localField:
            "bikedriverdetails.addressId",
          foreignField: "_id",
          as: "bikedriverdetails.addressDetails",
        },
      },
      { $unwind: "$bikedriverdetails.addressDetails" },
       {$unset:"bikedriverdetails.addressId",},
      {
        $lookup: {
          from: "driverdoc",
          localField: "bikedriverdetails.docId",
          foreignField: "_id",
          as: "bikedriverdetails.docDetails",
        },
      },
      { $unwind: "$bikedriverdetails.docDetails" },
      {$unset:"bikedriverdetails.docId",},
      {
        $project: {
          // _id: 1,
          _id: "$_id",
          bikeDriverId: "$bikeDriverId",
          totalBottleCapacity: "$totalBottleCapacity",
          totalReserveCapacity: "$totalReserveCapacity",
          deliveredReserveBottle: "$deliveredReserveBottle",
          returnedReserveBottle: "$returnedReserveBottle",
          damagedBottle: "$damagedBottle",
          leakageBottle: "$leakageBottle",
          brokenBottle: "$brokenBottle",
          productOrderDetails:"$productOrder.productOrderDetails",
        productOrderDetails:{
            
            _id:"$productOrder.productOrderDetails._id",
            orderId:"$productOrder.productOrderDetails.orderId",
            transactionId:"$productOrder.productOrderDetails.transactionId",
            userId:"$productOrder.productOrderDetails.userId",
            product:{
                // qty:"$qty",
                productDetails:{
                    _id:"$productOrder.productOrderDetails.product.productDetails._id",
                    productName:"$productOrder.productOrderDetails.product.productDetails.productName",
                    productImage:"$productOrder.productOrderDetails.product.productDetails.productImage",
                    productPrice:"$productOrder.productOrderDetails.product.productDetails.productPrice",
                    productUOM:"$productOrder.productOrderDetails.product.productDetails.productUOM",
                    // qty:"$productOrder.qty",
                    
            }
            }
        },
          bottleQunatityDetails:"$productOrder.bottleQunatity",
          activeStatus: "$activeStatus",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          bikeDriverDetails:"$bikedriverdetails",
        },
      },
      {
        $group: {
          _id: "$_id",
          bikeDriverId: { $first: "$bikeDriverId" },
          totalBottleCapacity: { $first: "$totalBottleCapacity" },
          totalReserveCapacity: { $first: "$totalReserveCapacity" },
          deliveredReserveBottle: { $first: "$deliveredReserveBottle" },
          returnedReserveBottle: { $first: "$returnedReserveBottle" },
          damagedBottle: { $first: "$damagedBottle" },
          leakageBottle: { $first: "$leakageBottle" },
          brokenBottle: { $first: "$brokenBottle" },
          orderDetails: {
            $addToSet: {
                         bottleQunatity: "$bottleQunatityDetails", // Add bottle quantity field here
                         productOrderDetails: "$productOrderDetails",
                    },
         },
          activeStatus: { $first: "$activeStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          bikeDriverDetails: { $first: "$bikeDriverDetails" },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (assignOrderBiker[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.AssignZoneForAssignTruckNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const total = parseInt(assignOrderBiker[0].metadata[0].total);
    var totalPage = Math.ceil(
      parseInt(assignOrderBiker[0].metadata[0].total) / limit
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.AssignZoneForAssignTruckListAdmin,
      totalData: total,
      totalPage: totalPage,
      data: assignOrderBiker[0].data,
    });
  },




  /** */
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
  /** */
};
