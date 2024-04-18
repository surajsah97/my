const express = require("express");
const router = express.Router();
const truckBrand = require("../../controller/truckBrand_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .get( errorfun(truckBrand.brandListFront))
  .get(Auth.apiValidateToken, errorfun(truckBrand.brandListFront));

module.exports = router;
