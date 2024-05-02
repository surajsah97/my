const express = require("express");
const router = express.Router();
const AssignOrderForBikeDriver = require("../../controller/AssignOrderForBikeDriver_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post(
    Auth.adminValidateToken,
    errorfun(AssignOrderForBikeDriver.addAssignOrderForBikeDriver)
  );
// .get(Auth.adminValidateToken,errorfun(AssignOrderForBikeDriver.getAllListAssignZone))

// router.route('/:id')
//     .get(Auth.adminValidateToken,errorfun(AssignOrderForBikeDriver.getAssignZoneByIdAdmin))
module.exports = router;
