const express = require("express");
const router = express.Router();
const path = require("path");
const AssignOrderForBikeDriver = require("../../controller/AssignOrderForBikeDriver_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/bikedriver/:id")
  .get(
    Auth.validateTokenBikeDriver,
    errorfun(AssignOrderForBikeDriver.getAllListAssignOrderBikedriverId)
  );
  router
  .route("/bikedrivers/truckdriver")
  .get(
    Auth.validateTokenBikeDriver,
    errorfun(AssignOrderForBikeDriver.getAllListAssignOrderScannerTruck)
  );
module.exports = router;
