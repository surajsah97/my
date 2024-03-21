const express = require("express");
const router = express.Router();
const Brand = require("../../controller/bikeBrand_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

// router.route("/").get( errorfun(Brand.brandListFront));
router.route("/").get(Auth.apiValidateToken, errorfun(Brand.brandListFront));

module.exports = router;
