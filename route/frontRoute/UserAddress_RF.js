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
router.route('/googlemap').get(errorfun(userAddress.googlemap));
router.route('/')
    .get(Auth.apiValidateToken, errorfun(userAddress.getAddress))
    .post(Auth.apiValidateToken, errorfun(userAddress.addAddress))

router.route('/:id')
    .put(Auth.apiValidateToken, errorfun(userAddress.updateAddress))
    .delete(Auth.apiValidateToken, errorfun(userAddress.deleteaddress))

module.exports = router;