const express = require("express");
const router = express.Router();
const path = require("path");
const userAddress = require("../../controller/UserAddress_C");
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun = require("../../middleware/catchAsyncErrors");
router.route("/googlemap").get(errorfun(userAddress.googlemap));
router
  .route("/")
  .get(Auth.apiValidateToken, errorfun(userAddress.getAddress))
  .post(Auth.apiValidateToken, errorfun(userAddress.addAddress));

router
  .route("/:id")
  .put( errorfun(userAddress.updateAddress))
  // .put(Auth.apiValidateToken, errorfun(userAddress.updateAddress))
  .delete(Auth.apiValidateToken, errorfun(userAddress.deleteaddress));

module.exports = router;
