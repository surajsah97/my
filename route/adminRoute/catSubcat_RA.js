const express = require("express");
const router = express.Router();
const cat = require("../../controller/catSubcat_C");
const Auth = require("../../middleware/auth");
const path = require("path");
const multer = require("multer");

const errorfun = require("../../middleware/catchAsyncErrors");

const localStorage = multer.diskStorage({
  destination: (req, res, next) => {
    next(null, path.join(__dirname, "../../public/uploads/catsubcat"));
  },
  filename: (req, file, next) => {
    next(null,file.originalname);
  },
});
var upload1 = multer({ storage: localStorage });
/* GET home page. */
var cpUpload = upload1.fields([
  { name: "categoryImg", maxCount: 1 },
  { name: "subCategoryImg", maxCount: 1 },
]);

// category router //
router
  .route("/category/")
  .get(Auth.adminValidateToken, errorfun(cat.categoryListAdmin))
  .post(cpUpload, Auth.adminValidateToken, errorfun(cat.addCategoryAdmin));

router
  .route("/category/:id")
  .put(cpUpload, Auth.adminValidateToken, errorfun(cat.updateCategoryAdmin))
  .get(Auth.adminValidateToken, errorfun(cat.singleCategoryByIdAdmin))
  .delete(Auth.adminValidateToken, errorfun(cat.categoryDeleteAdmin));

// subCategory router //
router
  .route("/subcategory/")
  .get(Auth.adminValidateToken, errorfun(cat.SubcategoryListAdmin))
  .post(cpUpload, Auth.adminValidateToken, errorfun(cat.addSubCategoryAdmin));

router
  .route("/subcategory/:id")
  .put(cpUpload, Auth.adminValidateToken, errorfun(cat.updateSubCategoryAdmin))
  .delete(Auth.adminValidateToken, errorfun(cat.SubcategoryDeleteAdmin))
  .get(Auth.adminValidateToken, errorfun(cat.singleSubCategoryByIdAdmin));

module.exports = router;
