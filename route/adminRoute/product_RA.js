const express = require('express')
const router = express.Router();
const path = require("path")
const product = require("../../controller/product_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");
const errorfun=require("../../middleware/catchAsyncErrors")
const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/products'))
    },
    filename: (req, file, next) => {
        next(null, file.originalname)
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'productImage', maxCount: 1 },
])
router.route('/')
    // .get( errorfun(product.productListAdmin))
    .get(Auth.adminValidateToken, errorfun(product.productListAdmin))
    .post(cpUpload,Auth.adminValidateToken,  errorfun(product.addProduct))
    // .post(cpUpload,  errorfun(product.addProduct))

router.route('/:id')
    .put(cpUpload, errorfun(product.updateProduct))
    // .put(cpUpload, Auth.adminValidateToken, errorfun(product.updateProduct))
    .delete(Auth.adminValidateToken, errorfun(product.deleteProduct))

module.exports = router;