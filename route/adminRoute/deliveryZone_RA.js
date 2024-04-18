const express = require("express");
const router = express.Router();
const deliveryZone = require("../../controller/deliveryZone_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get(Auth.adminValidateToken, errorfun(deliveryZone.zoneNameListBYadmin))
  .post(Auth.adminValidateToken, errorfun(deliveryZone.addzoneName));

router
  .route("/:id")
  .put(Auth.adminValidateToken, errorfun(deliveryZone.updatezoneName))
  .delete(
    Auth.adminValidateToken,
    errorfun(deliveryZone.zoneNameDeleteBYAdmin)
  );

module.exports = router;
