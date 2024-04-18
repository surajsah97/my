var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bikeModelSchema = new Schema(
  {
    bikeModel: {
      type: String,
      required: true,
      trim: true,
    },
    bikeBrandId: {
      type: Schema.Types.ObjectId,
      ref: constants.BikeBrandModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.BikeModelModel,
    versionKey: false,
    timestamps: true,
  }
);
let subCategory = mongoose.model(constants.BikeModelModel, bikeModelSchema);
module.exports = subCategory;
