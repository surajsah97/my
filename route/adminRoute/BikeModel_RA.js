const express = require("express");
const router = express.Router();
const Model = require("../../controller/bikeModel_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .get( errorfun(Model.modelListAdmin))
  .get(Auth.adminValidateToken, errorfun(Model.modelListAdmin))
  // .post( errorfun(Model.addmodel));
  .post(Auth.adminValidateToken, errorfun(Model.addmodel));

router
  .route("/:id")
  // .put( errorfun(Model.updateModel))
  .put(Auth.adminValidateToken, errorfun(Model.updateModel))
  // .delete( errorfun(Model.modelDelete));
  .delete(Auth.adminValidateToken, errorfun(Model.modelDelete));

module.exports = router;
