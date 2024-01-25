const express = require('express');
const router = express.Router();
const cat = require("../../controller/catSubcat_C");
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

// category router //
router.route('/category/')
    .get(Auth.apiValidateToken, errorfun(cat.categoryListFront))

// subCategory router //
router.route('/subcategory/')
    .get(Auth.apiValidateToken, errorfun(cat.SubcategoryListFront))

module.exports = router;