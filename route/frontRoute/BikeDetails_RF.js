const express = require("express");
const router = express.Router();
const BikeDetails = require("../../controller/bikeDetails_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

// router.get(
//   "/getVehicleSingleFront",
//   errorfun(BikeDetails.getVehicleSingleFront)
// );
router.get(
  "/getVehicleSingleFront",Auth.apiValidateToken,
  errorfun(BikeDetails.getVehicleSingleFront)
);
// router.get("/vehicleListFront", errorfun(BikeDetails.VehicleListFront));
router.get("/vehicleListFront",Auth.apiValidateToken, errorfun(BikeDetails.VehicleListFront));

module.exports = router;
