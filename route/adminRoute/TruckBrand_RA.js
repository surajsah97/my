const express = require("express");
const router = express.Router();
const truckBrand = require("../../controller/truckBrand_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .get(errorfun(truckBrand.brandListAdmin))
  .get(Auth.adminValidateToken, errorfun(truckBrand.brandList))
  // .post(errorfun(truckBrand.addBrand))
  .post(Auth.adminValidateToken, errorfun(truckBrand.addBrand));

router
  .route("/:id")
  // .put(errorfun(truckBrand.updateBrand))
  .put(Auth.adminValidateToken, errorfun(truckBrand.updateBrand))
  // .delete(errorfun(truckBrand.brandDelete))
  .delete(Auth.adminValidateToken, errorfun(truckBrand.brandDelete));

module.exports = router;
