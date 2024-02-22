const express = require("express");
const router = express.Router();

const productCheckout = require("../../controller/productCheckout_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post( errorfun(productCheckout.productCheckout));
//   .post(Auth.apiValidateToken, errorfun(productCheckout.productCheckout));

module.exports = router;
