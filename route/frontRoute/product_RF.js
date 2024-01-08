const express = require('express')
const router = express.Router();
const path = require("path")
const cat = require("../../controller/product_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}


router.route('/')
    .get(errorfun(cat.productListFront))


module.exports = router;