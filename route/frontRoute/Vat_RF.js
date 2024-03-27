const express = require("express");
const router = express.Router();
const Vat = require("../../controller/vat_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router.route("/").get( errorfun(Vat.vatListFront));
// router.route("/").get(Auth.apiValidateToken, errorfun(Vat.vatListFront));

module.exports = router;
