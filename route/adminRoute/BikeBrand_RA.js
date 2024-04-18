const express = require("express");
const router = express.Router();
const Brand = require("../../controller/bikeBrand_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .get( errorfun(Brand.brandListAdmin))
  .get(Auth.adminValidateToken, errorfun(Brand.brandListAdmin))
  // .post( errorfun(Brand.addBrand));
  .post(Auth.adminValidateToken, errorfun(Brand.addBrand));

router
  .route("/:id")
  // .put( errorfun(Brand.updateBrand))
  .put(Auth.adminValidateToken, errorfun(Brand.updateBrand))
  // .delete( errorfun(Brand.brandDelete));
  .delete(Auth.adminValidateToken, errorfun(Brand.brandDelete));

module.exports = router;
