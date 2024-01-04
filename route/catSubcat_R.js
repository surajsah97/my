const express = require('express')
const router = express.Router();
const cat = require("../controller/catSubcat_C")
const Auth = require("../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

// category router //
router.post("/addCategory", errorfun(cat.addCategory))
router.post("/updateCategory", errorfun(cat.updateCategory))
router.get("/categoryList", errorfun(cat.categoryList))
router.get("/categoryListFront", errorfun(cat.categoryListFront))
router.delete("/categoryDelete/:id", errorfun(cat.categoryDelete))

// subCategory router //
router.post("/addSubCategory", errorfun(cat.addSubCategory))
router.post("/updateSubCategory", errorfun(cat.updateSubCategory))
router.get("/SubcategoryList", errorfun(cat.SubcategoryList))
router.get("/SubcategoryListFront", errorfun(cat.SubcategoryListFront))
router.delete("/SubcategoryDelete/:id", errorfun(cat.SubcategoryDelete))


module.exports = router;