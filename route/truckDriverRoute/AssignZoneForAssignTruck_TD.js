const express = require('express')
const router = express.Router();
const path = require("path");
const AssignZoneForAssignTruck = require("../../controller/AssignZoneForAssignTruck_C");
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors");

router.route('/:id')
    .get(Auth.validateTokenTruckDriver,errorfun(AssignZoneForAssignTruck.getAssignZoneByAssignTruckId))
module.exports = router;