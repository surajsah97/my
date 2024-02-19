const express = require('express')
const router = express.Router();
const subplan = require("../../controller/subscriptionPlan_C")
const Auth = require("../../middleware/auth");
const errorfun=require("../../middleware/catchAsyncErrors")


router.route('/')
    .get(Auth.apiValidateToken, errorfun(subplan.subscriptionPlanListFront))

module.exports = router;