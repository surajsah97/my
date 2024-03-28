const express = require('express')
const router = express.Router();
const path = require("path");
const TruckDriver = require("../../controller/TruckDriverDetails_C");
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors");

const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/truckdriver'))
    },
    filename: (req, file, next) => {
        // next(null, Date.now() + "-" + file.originalname)
        next(null, file.originalname)
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
    // .get(errorfun(TruckDriver.getTruckDriverListAdmin))
    .get(Auth.adminValidateToken,errorfun(TruckDriver.getTruckDriverListAdmin))
    // .post(cpUpload, errorfun(TruckDriver.addTruckDriver))
    .post(cpUpload,Auth.adminValidateToken, errorfun(TruckDriver.addTruckDriver))

router.route('/:id')
//     .put(cpUpload, errorfun(BikeDetails.updateVehicle))
//     .put(cpUpload,Auth.adminValidateToken, errorfun(BikeDetails.updateVehicle))
    .delete(errorfun(TruckDriver.truckDriverDelete))
    // .delete(Auth.adminValidateToken,errorfun(TruckDriver.truckDriverDelete))

module.exports = router;