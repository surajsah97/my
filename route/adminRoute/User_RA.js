const express = require('express')
const router = express.Router();
const User = require("../../controller/User_C")
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors")

router.route('/')
    .get(errorfun(User.getAllUserListByAdmin))
router.route('/usercount')
    .get(errorfun(User.getUserCountByAdmin))

module.exports = router;