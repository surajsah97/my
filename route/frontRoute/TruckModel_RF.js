const express = require("express");
const router = express.Router();
const Model = require("../../controller/truckModel_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router.route("/").get(errorfun(Model.modelListFront));
// router.route("/").get(Auth.apiValidateToken, errorfun(Model.modelListFront));

module.exports = router;
