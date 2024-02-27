const express = require('express')
const router = express.Router();
const TrialUsers=require("../../controller/trialUser_C");
const errorfun = require("../../middleware/catchAsyncErrors");
const auth = require("../../middleware/auth")

router
  .route("/")
  .post(auth.reCAPTCHA, errorfun(TrialUsers.addTrailUsers));

module.exports = router;