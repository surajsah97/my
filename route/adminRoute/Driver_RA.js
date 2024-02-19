const express = require('express')
const router = express.Router();
const path = require("path")
const Driver = require("../../controller/Driver_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors")


const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/driver'))
    },
    filename: (req, file, next) => {
        next(null, Date.now() + "-" + file.originalname)
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'passportImgFront', maxCount: 1 },
    { name: 'passportImgBack', maxCount: 1 },
    { name: 'emiratesIdImgFront', maxCount: 1 },
    { name: 'emiratesIdImgBack', maxCount: 1 },
    { name: 'licenseImgFront', maxCount: 1 },
    { name: 'licenseImgBack', maxCount: 1 },
    { name: 'visaImg', maxCount: 1 },
    { name: 'driverImg', maxCount: 1 },
])


router.route('/')
    .get(errorfun(Driver.getDriverAdmin))
    .post(cpUpload, errorfun(Driver.addDriver))

router.route('/:id')
//     .put(cpUpload, errorfun(BikeDetails.updateVehicle))
    .delete(errorfun(Driver.driverDelete))




module.exports = router;