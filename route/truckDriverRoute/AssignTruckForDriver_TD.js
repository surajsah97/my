const express = require("express");
const router = express.Router();
const path = require("path");
const AssignTruckForDriver = require("../../controller/AssignTruckForDriver_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/:id")
  .get(errorfun(AssignTruckForDriver.getAssignTruckByTruckDriverId));
// .get(Auth.validateTokenTruckDriver,errorfun(AssignTruckForDriver.getAssignTruckByTruckDriverId))
module.exports = router;
