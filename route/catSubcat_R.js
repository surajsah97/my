const express = require('express')
const router = express.Router();
const cat = require("../controller/catSubcat_C")
const Auth = require("../middleware/auth");

router.post("/addCategory", cat.addCategory)
router.post("/updateCategory", cat.updateCategory)
router.get("/categoryList", cat.categoryList)



module.exports = router;