const express = require("express");
const router = express.Router();
const Auth = require("../../middleware/auth");
const userSubscription = require("../../controller/userSubscription_C");
const errorfun = require("../../middleware/catchAsyncErrors");
router.post("/addSubscription", errorfun(userSubscription.addSub));
// router.post("/addSubscription", Auth.apiValidateToken,errorfun(userSubscription.addSub))
router.get("/", errorfun(userSubscription.subscriptionListFront));
// router.get("/", Auth.apiValidateToken,errorfun(userSubscription.subscriptionListFront))
router.get(
  "/subscriptionId",
  errorfun(userSubscription.singleSubscriptionByIdFront)
);
// router.get("/", Auth.apiValidateToken,errorfun(userSubscription.singleSubscriptionByIdFront))
router.put(
  "/updateSubscription/:id",
  errorfun(userSubscription.updateSubscriptionByUser)
);
// router.put("/updateSubscription/:id", Auth.apiValidateToken,errorfun(userSubscription.updateSubscriptionByUser))
router.delete("/deleteSubscription/:id", errorfun(userSubscription.deletesub));
// router.delete("/deleteSubscription", Auth.apiValidateToken,errorfun(userSubscription.deletesub))

module.exports = router;
