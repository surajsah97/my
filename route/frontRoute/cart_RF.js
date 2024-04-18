const express = require("express");
const router = express.Router();
const cart = require("../../controller/cart_C.js");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .post( errorfun(cart.addTpCart))
  .post(Auth.apiValidateToken, errorfun(cart.addTpCart))
  .get(Auth.apiValidateToken, errorfun(cart.getCartByuser))
  //   .post(Auth.apiValidateToken, errorfun(cart.getCartByuser));
  .put(Auth.apiValidateToken, errorfun(cart.updateCart));

module.exports = router;
