const express = require('express')
const router = express.Router();
const Driver = require("../../controller/Driver_C")
const Auth = require("../../middleware/auth");
const firebase = require('../../service/firebase/firebaseFunctions');

const errorfun=require("../../middleware/catchAsyncErrors")

router.post("/login", errorfun(Driver.login))
router.put("/reSendOtp", errorfun(Driver.reSendOtp))
router.put("/resetPass", errorfun(Driver.resetPass))
router.put("/forgetPass", errorfun(Driver.forgetPass))
router.put("/changePass", Auth.apiValidateToken, errorfun(Driver.changePass))
router.get("/getDriverProfile", Auth.apiValidateToken, errorfun(Driver.getDriverProfile))

module.exports = router;