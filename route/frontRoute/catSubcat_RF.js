const express = require("express");
const router = express.Router();
const cat = require("../../controller/catSubcat_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors.js");

// category router //
router
  .route("/category/")
  .get(errorfun(cat.categoryListFront));
  // .get(Auth.apiValidateToken, errorfun(cat.categoryListFront));

// subCategory router //
router
  .route("/subcategory/")
  // .get( errorfun(cat.SubcategoryListFront));
  .get(Auth.apiValidateToken, errorfun(cat.SubcategoryListFront));

module.exports = router;
