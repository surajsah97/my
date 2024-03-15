const express = require('express');
const router = express.Router();
const subscriptionCheckOut = require("../../controller/subscriptionCheckOut_C");
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/')
    .post( errorfun(subscriptionCheckOut.checkoutSubscription))
    // .post(Auth.apiValidateToken, errorfun(subscriptionCheckOut.checkoutSubscription));

module.exports = router;
