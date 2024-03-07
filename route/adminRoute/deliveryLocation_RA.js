const express = require("express");
const router = express.Router();
const location = require("../../controller/deliveryLocation_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
    .route("/")
    // .get( errorfun(location.locationList))
    .get(Auth.adminValidateToken, errorfun(location.locationList))
    // .post( errorfun(location.addlocation))
    .post(Auth.adminValidateToken, errorfun(location.addlocation));

router
    .route("/:id")
    .put(Auth.adminValidateToken, errorfun(location.updatelocation))
    .delete(Auth.adminValidateToken, errorfun(location.locationDelete));

module.exports = router;