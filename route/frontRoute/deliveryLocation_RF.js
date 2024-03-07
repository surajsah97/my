const express = require("express");
const router = express.Router();
const location = require("../../controller/deliveryLocation_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");


router.get("/", errorfun(location.locationListFront));
// router.get("/", Auth.apiValidateToken, errorfun(location.locationListFront));

module.exports = router;
