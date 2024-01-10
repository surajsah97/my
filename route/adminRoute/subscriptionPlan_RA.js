const express = require('express')
const router = express.Router();
const subplan = require("../../controller/subscriptionPlan_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

// category router //
router.route('/')
    .get(errorfun(subplan.subscriptionPlanList))
    .post(errorfun(subplan.addsubscriptionPlan))

router.route('/:id')
    .put(errorfun(subplan.updatesubscriptionPlan))
    .delete(errorfun(subplan.subscriptionPlanDelete))


module.exports = router;