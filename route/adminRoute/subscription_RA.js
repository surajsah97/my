const express = require("express");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userSubscription = require("../../controller/userSubscription_C");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get(
    Auth.adminValidateToken,
    errorfun(userSubscription.subscriptionListByAdmin)
  );

module.exports = router;
