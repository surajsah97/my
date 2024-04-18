var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bikeBrandSchema = new Schema(
  {
    bikeBrand: {
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
    collection: constants.BikeBrandModel,

    timestamps: true,
  }
);
let about_cms = mongoose.model(constants.BikeBrandModel, bikeBrandSchema);
module.exports = about_cms;
