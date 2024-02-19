const express = require('express')
const router = express.Router();
const Model = require("../../controller/bikeModel_C")
const Auth = require("../../middleware/auth");

const errorfun=require("../../middleware/catchAsyncErrors")

router.route('/')
    .get(Auth.adminValidateToken, errorfun(Model.modelList))
    .post(Auth.adminValidateToken, errorfun(Model.addmodel))

router.route('/:id')
    .put(Auth.adminValidateToken, errorfun(Model.updateModel))
    .delete(Auth.adminValidateToken, errorfun(Model.modelDelete))

module.exports = router;