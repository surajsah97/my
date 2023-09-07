const express = require('express')
const router = express.Router();
const cat = require("../controller/catSubcat_C")
const Auth = require("../middleware/auth");

router.post("/addCategory", cat.addCategory)
router.post("/updateCategory", cat.updateCategory)
router.get("/categoryList", cat.categoryList)
router.get("/categoryListFront", cat.categoryListFront)
router.delete("/categoryDelete/:id", cat.categoryDelete)



module.exports = router;