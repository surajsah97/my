const express = require("express");
const router = express.Router();
const TrialUsers = require("../../controller/trialUser_C");
const errorfun = require("../../middleware/catchAsyncErrors");
const Auth = require("../../middleware/auth");

router
  .route("/")
  // .get( errorfun(TrialUsers.trialusersListAdmin));
  .get(Auth.adminValidateToken, errorfun(TrialUsers.trialusersListAdmin));

module.exports = router;
