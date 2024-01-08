const express = require('express')
const router = express.Router();
const User = require("../../controller/User_C")
const Auth = require("../../middleware/auth");

const errorfun = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}
router.route('/')
    .get(errorfun(User.getUserAdmin))



module.exports = router;