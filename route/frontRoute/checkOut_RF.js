const express = require('express');
const router = express.Router();
const checkOut = require("../../controller/checkOut_C");
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

router.route('/')
    .post(errorfun(checkOut.checkOut))

module.exports = router;