const express = require('express')
const router = express.Router();
const path = require("path")
const userAddress = require("../../controller/UserAddress_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

router.route('/')
    .get(Auth.adminValidateToken, errorfun(userAddress.getAddress))
    .post(Auth.adminValidateToken, errorfun(userAddress.addAddress))

router.route('/:id')
    .put(Auth.adminValidateToken, errorfun(userAddress.updateAddress))
    .delete(Auth.adminValidateToken, errorfun(userAddress.deleteaddress))

module.exports = router;