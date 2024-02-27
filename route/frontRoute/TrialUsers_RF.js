const express = require('express')
const router = express.Router();
const TrialUsers=require("../../controller/trialUser_C");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post(errorfun(TrialUsers.addTrailUsers));

module.exports = router;