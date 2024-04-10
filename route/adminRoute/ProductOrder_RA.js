const express = require("express");
const router = express.Router();

const productOrder = require("../../controller/productOrder_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post(Auth.adminValidateToken, errorfun(productOrder.orderListByAdmin));

module.exports = router;