const express = require("express");
const router = express.Router();
const Vat = require("../../controller/vat_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
//   // .get( errorfun(Vat.brandListAdmin))
//   .get(Auth.adminValidateToken, errorfun(Vat.brandListAdmin))
  .post( errorfun(Vat.addVat));
//   .post(Auth.adminValidateToken, errorfun(Vat.addVat));

// router
//   .route("/:id")
//   // .put( errorfun(Vat.updateBrand))
//   .put(Auth.adminValidateToken, errorfun(Vat.updateBrand))
//   // .delete( errorfun(Vat.brandDelete));
//   .delete(Auth.adminValidateToken, errorfun(Vat.brandDelete));

module.exports = router;