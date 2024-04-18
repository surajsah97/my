var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryImg: {
      type: String,
      required: true,
      trim: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.CategoryModel,
    versionKey: false,
    timestamps: true,
  }
);
let about_cms = mongoose.model(constants.CategoryModel, categorySchema);
module.exports = about_cms;
