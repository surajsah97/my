const express = require('express')
const router = express.Router();
const User = require("../../controller/User_C")
const Auth = require("../../middleware/auth");
const firebase = require('../../service/firebase/firebaseFunctions');
const map = require("../../controller/UserAddress_C")
const multer = require("multer");
const path = require("path")

const errorfun=require("../../middleware/catchAsyncErrors")

const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/user'))
    },
    filename: (req, file, next) => {
        next(null, Date.now() + "-" + file.originalname)
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'userImage', maxCount: 1 },
])

router.post("/usersingup", errorfun(User.UserSingup))
router.post("/login", errorfun(User.login))
router.put("/verifieuser", errorfun(User.VerifieUser))
router.put("/resendotp", errorfun(User.reSendOtp))
router.put("/resetpass", errorfun(User.resetPass))
router.put("/forgetpass", errorfun(User.forgetPass))
router.put("/changepass", Auth.apiValidateToken, errorfun(User.changePass))
router.put("/updateuserprofile", cpUpload,errorfun(User.updateUserProfile))
router.get("/getuserprofile", Auth.apiValidateToken, errorfun(User.getUserProfile))
router.delete("/deleteuser/:id", Auth.apiValidateToken, errorfun(User.deleteUser))
router.get("/firebasesms", firebase.firebasesms)
router.get("/map", map.googlemap)
module.exports = router;