const express = require('express')
const router = express.Router();
const cat = require("../../controller/catSubcat_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

// category router //
router.route('/category/')
    .get(errorfun(cat.categoryList))
    .post(errorfun(cat.addCategory))

router.route('/category/:id')
    .put(errorfun(cat.updateCategory))
    .delete(errorfun(cat.categoryDelete))

// subCategory router //
router.route('/subcategory/')
    .get(Auth.adminValidateToken, cat.SubcategoryList)
    .post(errorfun(cat.addSubCategory))

router.route('/subcategory/:id')
    .put(errorfun(cat.updateSubCategory))
    .delete(errorfun(cat.SubcategoryDelete))

module.exports = router;