const express = require("express");
const router = express.Router();
const AssignBikeDriverForAssigntruck = require("../../controller/AssignBikeDriverForAssigntruck._C.js");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post(
    Auth.adminValidateToken,
    errorfun(AssignBikeDriverForAssigntruck.addAssignBikedriverForAssignTruck)
  )
// .get(Auth.adminValidateToken,errorfun(AssignBikeDriverForAssigntruck.getAllListAssignOrderAdmin));

// router.route('/:id')
//     .get(Auth.adminValidateToken,errorfun(AssignBikeDriverForAssigntruck.getAssignZoneByIdAdmin))
module.exports = router;
