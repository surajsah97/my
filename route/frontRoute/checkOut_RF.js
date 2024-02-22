const express = require('express');
const router = express.Router();
const checkOut = require("../../controller/checkOut_C");
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/')
    .post(Auth.apiValidateToken, errorfun(checkOut.checkOut))

module.exports = router;
