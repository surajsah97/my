const express = require('express')
const router = express.Router();
const Admin = require("../../controller/pushNotification_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}
router.route('/')
    .post(errorfun(Admin.testnotification));



module.exports = router;