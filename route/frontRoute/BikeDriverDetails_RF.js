const express = require("express");
const router = express.Router();
const BikeDriverDetails = require("../../controller/bikeDriverDetails_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router.get(
  "/bikedriverprofile",
  Auth.validateTokenBikeDriver,
  errorfun(BikeDriverDetails.getBikeDriverProfileFront)
);
router.get(
  "/singlebikedriverdetails",
  Auth.apiValidateToken,
  errorfun(BikeDriverDetails.getSingleBikeDriverDetailsFront)
);

router.get(
  "/bikeDriverListFront",
  Auth.validateTokenBikeDriver,
  errorfun(BikeDriverDetails.bikeDriverListFront)
);
// router.put(
//   "/updatebikedriverlocation/:id",
//   errorfun(BikeDriverDetails.updateBikeDriverLocation);
// );
router.put("/updatebikedriverlocation/:id",Auth.validateTokenBikeDriver, errorfun(BikeDriverDetails.updateBikeDriverLocation));

router.route("/login").post(errorfun(BikeDriverDetails.loginBikeDriver));

router
  .route("/changepassword")
  .post(
    Auth.validateTokenBikeDriver,
    errorfun(BikeDriverDetails.changePassword)
  );

router
  .route("/forgetpassword")
  .post(errorfun(BikeDriverDetails.forgetPassword));

router.route("/resetpassword").post(errorfun(BikeDriverDetails.resetPassword));

router.route("/resendotp").post(errorfun(BikeDriverDetails.reSendOtp));

module.exports = router;
