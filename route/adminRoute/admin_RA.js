const express = require('express')
const router = express.Router();
const Admin = require("../../controller/admin_C")
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/login')
    .post(errorfun(Admin.login));
    
router.route('/singup')
    .post(errorfun(Admin.adminSingup));

module.exports = router;