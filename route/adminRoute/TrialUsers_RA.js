const express = require('express')
const router = express.Router();
const TrialUsers=require("../../controller/trialUser_C");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .get( errorfun(TrialUsers.trialusersListAdmin));
 
router
  .route("/:date")
  .get( errorfun(TrialUsers.trialusersListAdminBYdate));
 

module.exports = router;