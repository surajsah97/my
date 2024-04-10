const express = require('express')
const router = express.Router();
const AssignUserAddressForBikeDriver = require("../../controller/AssignUserAddressForBikeDriver_C");

const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors");

router.route('/')
    .post(Auth.adminValidateToken, errorfun(AssignUserAddressForBikeDriver.addAssignUserAddress))
    // .get(Auth.adminValidateToken,errorfun(AssignZoneForAssignTruck.getAllListAssignZone))

// router.route('/:id')
//     .get(Auth.adminValidateToken,errorfun(AssignZoneForAssignTruck.getAssignZoneByIdAdmin))
module.exports = router;