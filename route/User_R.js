const express = require('express')
const router = express.Router();
const User = require("../controller/User_C")

router.post("/UserSingup", User.UserSingup)

module.exports = router;