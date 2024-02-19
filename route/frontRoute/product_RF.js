const express = require('express')
const router = express.Router();
const path = require("path")
const cat = require("../../controller/product_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors")



router.route('/')
    .get(Auth.apiValidateToken, errorfun(cat.productListFront))

module.exports = router;