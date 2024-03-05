const express = require('express')
const router = express.Router();
const path = require("path")
const product = require("../../controller/product_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors")



router.route('/')
    // .get(errorfun(product.productListFront))
    .get(Auth.apiValidateToken, errorfun(product.productListFront))

module.exports = router;