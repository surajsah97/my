const express = require('express');
const router = express.Router();
const cart = require("../../controller/cart_C.js");
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/')
    .post( errorfun(cart.cartListByAdmin))
    //   .post(Auth.adminValidateToken, errorfun(cart.cartListByAdmin));

module.exports = router;
