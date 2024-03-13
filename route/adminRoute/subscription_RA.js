const express = require('express')
const router = express.Router();
const Auth = require("../../middleware/auth");
const userSubscription = require("../../controller/userSubscription_C");
const errorfun=require("../../middleware/catchAsyncErrors");

router
  .route("/").get(errorfun(userSubscription.subscriptionListByAdmin))
//   .route("/").get(errorfun(Auth.adminValidateToken,userSubscription.subscriptionListByAdmin));

module.exports = router;