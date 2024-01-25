const express = require('express')
const router = express.Router();
const User = require("../../controller/User_C")
const Auth = require("../../middleware/auth");
const firebase = require('../../service/firebase/firebaseFunctions');

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

router.post("/usersingup", errorfun(User.UserSingup))
router.post("/login", errorfun(User.login))
router.put("/verifieuser", errorfun(User.VerifieUser))
router.put("/resendotp", errorfun(User.reSendOtp))
router.put("/resetpass", errorfun(User.resetPass))
router.put("/forgetpass", errorfun(User.forgetPass))
router.put("/changepass", Auth.apiValidateToken, errorfun(User.changePass))
router.put("/updateuserprofile", Auth.apiValidateToken, errorfun(User.updateUserProfile))
router.get("/getuserprofile", Auth.apiValidateToken, errorfun(User.getUserProfile))

router.get("/firebasesms", firebase.firebasesms)

module.exports = router;