const express = require('express')
const router = express.Router();
const Model = require("../../controller/truckModel_C")
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors")

router.route('/')
    .get(errorfun(Model.modelListAdmin))
    .post(errorfun(Model.addmodel))

router.route('/:id')
    .put(errorfun(Model.updateModel))
    .delete(errorfun(Model.modelDelete))

module.exports = router;