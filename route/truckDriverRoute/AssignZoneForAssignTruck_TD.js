const express = require("express");
const router = express.Router();
const path = require("path");
const AssignZoneForAssignTruck = require("../../controller/AssignZoneForAssignTruck_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/truckdriver/:id")
  .get(
    Auth.validateTokenTruckDriver,
    errorfun(AssignZoneForAssignTruck.getAssignZoneByTruckDriverIdFront)
  );
module.exports = router;
