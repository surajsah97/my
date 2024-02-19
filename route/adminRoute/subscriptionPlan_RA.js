const express = require('express')
const router = express.Router();
const subplan = require("../../controller/subscriptionPlan_C")
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors")

router.route('/')
    .get(Auth.adminValidateToken, errorfun(subplan.subscriptionPlanList))
    .post(Auth.adminValidateToken, errorfun(subplan.addsubscriptionPlan))

router.route('/:id')
    .put(Auth.adminValidateToken, errorfun(subplan.updatesubscriptionPlan))
    .delete(Auth.adminValidateToken, errorfun(subplan.subscriptionPlanDelete))

module.exports = router;