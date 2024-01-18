const express = require('express')
const router = express.Router();
const Brand = require("../../controller/bikeBrand_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

// category router //
router.route('/')
    .get(errorfun(Brand.brandList))
    .post(errorfun(Brand.addBrand))

router.route('/:id')
    .put(errorfun(Brand.updateBrand))
    .delete(errorfun(Brand.brandDelete))



module.exports = router;