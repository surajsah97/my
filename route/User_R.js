const express = require('express')
const router = express.Router();
const User = require("../controller/User_C")
const Auth = require("../middleware/auth");

router.post("/UserSingup", User.UserSingup)
router.post("/login", User.login)
router.post("/VerifieUser", User.VerifieUser)
router.post("/reSendOtp", User.reSendOtp)
router.post("/resetPass", User.resetPass)
router.post("/forgetPass", User.forgetPass)
router.post("/changePass", Auth.apiValidateToken, User.changePass)
router.post("/updateUserProfile", Auth.apiValidateToken, User.updateUserProfile)


module.exports = router;