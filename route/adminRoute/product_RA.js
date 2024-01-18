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
    .get(errorfun(cat.productListAdmin))
    .post(cpUpload, errorfun(cat.addProduct))

router.route('/:id')
    .put(cpUpload, errorfun(cat.updateProduct))
    .delete(errorfun(cat.deleteProduct))




module.exports = router;