const express = require('express')
const router = express.Router();
const Auth = require("../../middleware/auth");
const userSubscription = require("../../controller/userSubscription_C")
const errorfun=require("../../middleware/catchAsyncErrors");
router.post("/addSubscription", errorfun(userSubscription.addSub))
// router.post("/addSubscription", Auth.apiValidateToken,errorfun(userSubscription.addSub))
router.get("/", errorfun(userSubscription.subscriptionListFront))
// router.get("/", Auth.apiValidateToken,errorfun(userSubscription.subscriptionListFront))
router.post("/updateSubscription", errorfun(userSubscription.updateSub));
// router.post("/updateSubscription", Auth.apiValidateToken,errorfun(userSubscription.updateSub))
router.delete("/deleteSubscription/:id", errorfun(userSubscription.deletesub));
// router.delete("/deleteSubscription", Auth.apiValidateToken,errorfun(userSubscription.deletesub))


module.exports = router;