const express = require('express')
const router = express.Router();

const AssignZoneForAssignTruck = require("../../controller/AssignZoneForAssignTruck_C");
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors");

router.route('/')
    .post(Auth.adminValidateToken, errorfun(AssignZoneForAssignTruck.addAssignZoneAdmin))
    .get(Auth.adminValidateToken,errorfun(AssignZoneForAssignTruck.getAllListAssignZoneAdmin))

    router.route('/assingtruckid/:id')
    .get(Auth.adminValidateToken,errorfun(AssignZoneForAssignTruck.getAssignZoneByAssignTruckIdAdmin))

router.route('/:id')
    .get(Auth.adminValidateToken,errorfun(AssignZoneForAssignTruck.getAssignZoneByIdAdmin))
module.exports = router;