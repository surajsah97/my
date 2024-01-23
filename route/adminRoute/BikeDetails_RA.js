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
        next(null, Date.now() +"-" +file.originalname )
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
])


router.route('/')
    .get(errorfun(BikeDetails.vehicleListAdmin))
    .post(cpUpload, errorfun(BikeDetails.addVehicle))

router.route('/:id')
    .put(cpUpload, errorfun(BikeDetails.updateVehicle))
    .delete(errorfun(BikeDetails.deletevehicle))




module.exports = router;