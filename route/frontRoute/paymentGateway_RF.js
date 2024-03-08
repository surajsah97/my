const express = require('express');
const router = express.Router();
const paymentGateway = require("../../controller/paymentGateway_C");
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")

router.route('/processPayment')
    .post(Auth.apiValidateToken, errorfun(paymentGateway.processPayment));
router.route('/refundPayment')
    .post(Auth.apiValidateToken, errorfun(paymentGateway.refundPayment));

module.exports = router;