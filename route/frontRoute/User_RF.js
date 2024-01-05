const express = require('express')
const router = express.Router();
const User = require("../../controller/User_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

router.post("/UserSingup", errorfun(User.UserSingup))
router.post("/login", errorfun(User.login))
router.put("/VerifieUser", errorfun(User.VerifieUser))
router.put("/reSendOtp", errorfun(User.reSendOtp))
router.put("/resetPass", errorfun(User.resetPass))
router.put("/forgetPass", errorfun(User.forgetPass))
router.put("/changePass", Auth.apiValidateToken, errorfun(User.changePass))
router.put("/updateUserProfile", Auth.apiValidateToken, errorfun(User.updateUserProfile))
router.get("/getUserProfile", Auth.apiValidateToken, errorfun(User.getUserProfile))





module.exports = router;