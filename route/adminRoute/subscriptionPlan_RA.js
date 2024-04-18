const express = require("express");
const router = express.Router();
const subplan = require("../../controller/subscriptionPlan_C");
const Auth = require("../../middleware/auth");

const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  // .get(errorfun(subplan.subscriptionPlanList))
  .get(Auth.adminValidateToken, errorfun(subplan.subscriptionPlanList))
  // .post( errorfun(subplan.addsubscriptionPlan))
  .post(Auth.adminValidateToken, errorfun(subplan.addsubscriptionPlan));

router
  .route("/:id")
  // .put( errorfun(subplan.updatesubscriptionPlan))
  .put(Auth.adminValidateToken, errorfun(subplan.updatesubscriptionPlan))
  // .delete( errorfun(subplan.subscriptionPlanDelete))
  .delete(Auth.adminValidateToken, errorfun(subplan.subscriptionPlanDelete));

module.exports = router;
