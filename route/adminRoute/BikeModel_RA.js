const express = require('express')
const router = express.Router();
const Model = require("../../controller/bikeModel_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

router.route('/')
    .get(errorfun(Model.modelList))
    .post(errorfun(Model.addmodel))

router.route('/:id')
    .put(errorfun(Model.updateModel))
    .delete(errorfun(Model.modelDelete))

module.exports = router;