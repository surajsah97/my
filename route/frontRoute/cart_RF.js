const express = require('express');
const router = express.Router();
const cart = require("../../controller/cart_C.js");
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/')
    .post( errorfun(cart.addTpCart))

module.exports = router;
