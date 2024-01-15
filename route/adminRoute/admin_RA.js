const express = require('express')
const router = express.Router();
const Admin = require("../../controller/admin_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}
router.route('/login')
    .post(errorfun(Admin.login));
router.route('/singup')
    .post(errorfun(Admin.adminSingup));



module.exports = router;