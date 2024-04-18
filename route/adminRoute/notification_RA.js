const express = require("express");
const router = express.Router();
const Admin = require("../../controller/pushNotification_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router.route("/").post(errorfun(Admin.testnotification));

module.exports = router;
