const express = require("express");
const router = express.Router();
const path = require("path");
const TruckDetails = require("../../controller/truckDetails_C");
const Auth = require("../../middleware/auth");
const multer = require("multer");

const errorfun = require("../../middleware/catchAsyncErrors");

const localStorage = multer.diskStorage({
  destination: (req, res, next) => {
    next(null, path.join(__dirname, "../../public/uploads/truck"));
  },
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
  { name: "mulkiyaImgFront", maxCount: 1 },
  { name: "mulkiyaImgBack", maxCount: 1 },
  { name: "vehicleImgFront", maxCount: 1 },
  { name: "vehicleImgBack", maxCount: 1 },
  { name: "vehicleImgLeft", maxCount: 1 },
  { name: "vehicleImgRight", maxCount: 1 },
  ,
]);

router
  .route("/")
  .get(errorfun(TruckDetails.TruckListAdmin))
  // .get(Auth.adminValidateToken,errorfun(TruckDetails.TruckListAdmin))
  .post(cpUpload, errorfun(TruckDetails.addTruck));
// .post(cpUpload,Auth.adminValidateToken, errorfun(TruckDetails.addTruck))

router
  .route("/:id")
  .put(cpUpload, errorfun(TruckDetails.updateTruck))
  // .put(cpUpload,Auth.adminValidateToken, errorfun(TruckDetails.updateTruck))
  .delete(errorfun(TruckDetails.deleteTruck))
// .delete(Auth.adminValidateToken,errorfun(TruckDetails.deleteTruck))
  .get(errorfun(TruckDetails.getSingleTruckDetailsByIdAdmin));
// .delete(Auth.adminValidateToken,errorfun(TruckDetails.deleteTruck))

module.exports = router;
