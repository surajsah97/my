const express = require('express')
const router = express.Router();
const cat = require("../controller/catSubcat_C")
const Auth = require("../middleware/auth");

// category router //
router.post("/addCategory", cat.addCategory)
router.post("/updateCategory", cat.updateCategory)
router.get("/categoryList", cat.categoryList)
router.get("/categoryListFront", cat.categoryListFront)
router.delete("/categoryDelete/:id", cat.categoryDelete)

// subCategory router //
router.post("/addSubCategory", cat.addSubCategory)
router.post("/updateSubCategory", cat.updateSubCategory)
router.get("/SubcategoryList", cat.SubcategoryList)
router.get("/SubcategoryListFront", cat.SubcategoryListFront)
router.delete("/SubcategoryDelete/:id", cat.SubcategoryDelete)


module.exports = router;