const express = require("express");
const router = express.Router();
const Brand = require("../../controller/bikeBrand_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get(Auth.adminValidateToken, errorfun(Brand.brandList))
  .post(Auth.adminValidateToken, errorfun(Brand.addBrand));

router
  .route("/:id")
  .put(Auth.adminValidateToken, errorfun(Brand.updateBrand))
  .delete(Auth.adminValidateToken, errorfun(Brand.brandDelete));

module.exports = router;