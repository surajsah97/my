const express = require("express");
const router = express.Router();
const Brand = require("../../controller/bikeBrand_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get( errorfun(Brand.brandListAdmin))
  .post( errorfun(Brand.addBrand));

router
  .route("/:id")
  .put( errorfun(Brand.updateBrand))
  .delete( errorfun(Brand.brandDelete));

module.exports = router;