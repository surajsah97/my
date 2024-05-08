const express = require("express");
const router = express.Router();
const AssignOrderForBikeDriver = require("../../controller/AssignOrderForBikeDriver_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/assigntruck/:id")
  .get(
    Auth.validateTokenTruckDriver,
    errorfun(AssignOrderForBikeDriver.getSingleAssignOrderBYIDAssigntruck)
  );
module.exports = router;
