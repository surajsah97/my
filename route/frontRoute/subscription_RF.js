const express = require('express')
const router = express.Router();
const path = require("path")
const cat = require("../../controller/product_C")
const Auth = require("../../middleware/auth");
const multer = require("multer");

const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../public/uploads'))
    },
    filename: (req, file, next) => {
        next(null, file.originalname)
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'productImage', maxCount: 1 },
])

router.post("/addProduct", cpUpload, cat.addProduct)
router.post("/updateProduct", cpUpload, cat.updateProduct)

module.exports = router;