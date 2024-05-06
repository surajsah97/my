const express = require("express");
const router = express.Router();

const productOrder = require("../../controller/productOrder_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post(Auth.adminValidateToken, errorfun(productOrder.orderListByAdmin));
router
  .route("/orderlistbyzoneid/:id")
  .post(Auth.adminValidateToken, errorfun(productOrder.orderListByZoneIdAdmin));
router
  .route("/listbyzoneidforassignorder/:id")
  .post(Auth.adminValidateToken, errorfun(productOrder.orderListByZoneIdAdminForassignorder));

module.exports = router;
