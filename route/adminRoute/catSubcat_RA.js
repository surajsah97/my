const express = require('express')
const router = express.Router();
const cat = require("../../controller/catSubcat_C")
const Auth = require("../../middleware/auth");
const path = require("path")
const multer = require("multer");

const errorfun=require("../../middleware/catchAsyncErrors")


const localStorage = multer.diskStorage({
    destination: (req, res, next) => {
        next(null, path.join(__dirname, '../../public/uploads/catsubcat'))
    },
    filename: (req, file, next) => {
        next(null, Date.now() + "-" + file.originalname)
    }
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
    { name: 'categoryImg', maxCount: 1 },
    { name: 'subCategoryImg', maxCount: 1 },
])

// category router //
router.route('/category/')
    .get(Auth.adminValidateToken, errorfun(cat.categoryList))
    // .post(cpUpload, errorfun(cat.addCategory))
    .post(cpUpload, Auth.adminValidateToken, errorfun(cat.addCategory))

router.route('/category/:id')
    // .put(cpUpload,  errorfun(cat.updateCategory))
    .put(cpUpload, Auth.adminValidateToken, errorfun(cat.updateCategory))
    .delete(Auth.adminValidateToken, errorfun(cat.categoryDelete))

// subCategory router //
router.route('/subcategory/')
    .get(Auth.adminValidateToken, cat.SubcategoryList)
    // .post(cpUpload,  errorfun(cat.addSubCategory))
    .post(cpUpload, Auth.adminValidateToken, errorfun(cat.addSubCategory))

router.route('/subcategory/:id')
    // .put(cpUpload,  errorfun(cat.updateSubCategory))
    .put(cpUpload, Auth.adminValidateToken, errorfun(cat.updateSubCategory))
    .delete(Auth.adminValidateToken, errorfun(cat.SubcategoryDelete))

module.exports = router;