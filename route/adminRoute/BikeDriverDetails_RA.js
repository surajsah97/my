const express = require('express')
const router = express.Router();
const path = require("path")
const bikeDRiverDetails = require("../../controller/bikeDriverDetails_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors");



const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/bike'))
    },
    filename: (req, file, next) => {
        next(null, file.originalname )
        // next(null, Date.now() +"-" +file.originalname )
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'mulkiyaImgFront', maxCount: 1 },
    { name: 'mulkiyaImgBack', maxCount: 1 },
    { name: 'vehicleImgFront', maxCount: 1 },
    { name: 'vehicleImgBack', maxCount: 1 },
    { name: 'vehicleImgLeft', maxCount: 1 },
    { name: 'vehicleImgRight', maxCount: 1 },
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
    
    .get(Auth.adminValidateToken,errorfun(bikeDRiverDetails.vehicleListAdmin))
    .post(Auth.adminValidateToken,cpUpload, errorfun(bikeDRiverDetails.addVehicle))

router.route('/:id')
    .put(Auth.adminValidateToken,cpUpload, errorfun(bikeDRiverDetails.updateVehicle))
    .delete(Auth.adminValidateToken,errorfun(bikeDRiverDetails.deletevehicle));
    

router.get(
  "/getVehicleSingleAdmin",Auth.adminValidateToken,
  errorfun(bikeDRiverDetails.getVehicleSingleAdmin)
);

module.exports = router;