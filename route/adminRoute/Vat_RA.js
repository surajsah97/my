const express = require("express");
const router = express.Router();
const Vat = require("../../controller/vat_C");
// const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get( errorfun(Vat.vatListAdmin))
//   .get(Auth.adminValidateToken, errorfun(Vat.vatListAdmin))
  .post( errorfun(Vat.addVat));
//   .post(Auth.adminValidateToken, errorfun(Vat.addVat));

router
  .route("/:id")
  .delete( errorfun(Vat.vatDelete))
//   .delete(Auth.adminValidateToken, errorfun(Vat.vatDelete));

module.exports = router;