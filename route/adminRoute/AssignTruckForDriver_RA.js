const express = require('express')
const router = express.Router();
const path = require("path");
const AssignTruckForDriver = require("../../controller/AssignTruckForDriver_C");
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors");


router.route('/')
    .post(Auth.adminValidateToken, errorfun(AssignTruckForDriver.asignTruck))
    .get(Auth.adminValidateToken,errorfun(AssignTruckForDriver.getAllListAssignBYAdmin))

// router.route('/:id')
// //     .put(cpUpload, errorfun(BikeDetails.updateVehicle))
// //     .put(cpUpload,Auth.adminValidateToken, errorfun(BikeDetails.updateVehicle))
//     .delete(errorfun(TruckDriver.truckDriverDelete))
//     // .delete(Auth.adminValidateToken,errorfun(TruckDriver.truckDriverDelete))

module.exports = router;