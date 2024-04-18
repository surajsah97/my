const express = require("express");
const router = express.Router();
const TruckDetails = require("../../controller/truckDetails_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router.route("/").get(errorfun(TruckDetails.vehicleListFront));
// router.route("/").get(Auth.apiValidateToken, errorfun(TruckDetails.vehicleListFront));

module.exports = router;
