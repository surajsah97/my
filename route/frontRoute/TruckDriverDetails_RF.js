const express = require("express");
const router = express.Router();
const TruckDriver = require("../../controller/TruckDriverDetails_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get(
    Auth.validateTokenTruckDriver,
    errorfun(TruckDriver.getTruckDriverProfile)
  );

router.route("/login").post(errorfun(TruckDriver.loginTruckDriver));

router
  .route("/changepassword")
  .post(Auth.validateTokenTruckDriver, errorfun(TruckDriver.changePass));

router.route("/forgetpassword").post(errorfun(TruckDriver.forgetPass));

router.route("/resetpassword").post(errorfun(TruckDriver.resetPass));

router.route("/resendotp").post(errorfun(TruckDriver.reSendOtp));

router.route("/logout").get(errorfun(TruckDriver.logoutTruckDriver));

module.exports = router;
