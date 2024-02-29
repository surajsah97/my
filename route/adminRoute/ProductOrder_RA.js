const express = require("express");
const router = express.Router();

const productOrder = require("../../controller/productOrder_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get( errorfun(productOrder.orderListByAdmin));
//   .post(Auth.apiValidateToken, errorfun(productOrder.createOrder.productCheckout));

module.exports = router;
