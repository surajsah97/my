const express = require('express')
const router = express.Router();
const path = require("path");
const AssignTruckForDriver = require("../../controller/AssignTruckForDriver_C");
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors");

router.route('/:id')
    .get(Auth.adminValidateToken,errorfun(AssignTruckForDriver.getAssignBYIdAdmin))
    .delete(Auth.adminValidateToken,errorfun(AssignTruckForDriver.assignDeleteById))
    .put(Auth.adminValidateToken,errorfun(AssignTruckForDriver.assignUpdateById))


router.route('/')
    .post(Auth.adminValidateToken, errorfun(AssignTruckForDriver.asignTruck))
    .get(Auth.adminValidateToken,errorfun(AssignTruckForDriver.getAllListAssignBYAdmin))


module.exports = router;