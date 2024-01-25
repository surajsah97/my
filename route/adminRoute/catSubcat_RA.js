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
    .get(Auth.adminValidateToken, errorfun(cat.categoryList))
    .post(Auth.adminValidateToken, errorfun(cat.addCategory))

router.route('/category/:id')
    .put(Auth.adminValidateToken, errorfun(cat.updateCategory))
    .delete(Auth.adminValidateToken, errorfun(cat.categoryDelete))

// subCategory router //
router.route('/subcategory/')
    .get(Auth.adminValidateToken, cat.SubcategoryList)
    .post(Auth.adminValidateToken, errorfun(cat.addSubCategory))

router.route('/subcategory/:id')
    .put(Auth.adminValidateToken, errorfun(cat.updateSubCategory))
    .delete(Auth.adminValidateToken, errorfun(cat.SubcategoryDelete))

module.exports = router;