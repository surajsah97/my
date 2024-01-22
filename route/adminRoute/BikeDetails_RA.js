const express = require('express')
const router = express.Router();
const path = require("path")
const BikeDetails = require("../../controller/bikeDetails_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/bike'))
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
    .get(errorfun(BikeDetails.productListAdmin))
    .post(cpUpload, errorfun(BikeDetails.addProduct))

router.route('/:id')
    .put(cpUpload, errorfun(BikeDetails.updateProduct))
    .delete(errorfun(BikeDetails.deleteProduct))




module.exports = router;