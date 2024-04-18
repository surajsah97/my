const express = require("express");
const router = express.Router();
const deliveryZone = require("../../controller/deliveryZone_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router.get(
  "/",
  Auth.validateTokenTruckDriver,
  errorfun(deliveryZone.zoneNameListTruckDriver)
);

module.exports = router;
