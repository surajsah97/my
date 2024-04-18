var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var truckBrandSchema = new Schema(
  {
    truckBrand: {
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
    collection: constants.TruckBrandModel,
    versionKey: false,
    timestamps: true,
  }
);
let about_cms = mongoose.model(constants.TruckBrandModel, truckBrandSchema);
module.exports = about_cms;
