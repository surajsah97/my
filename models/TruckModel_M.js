var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var truckModelSchema = new Schema(
  {
    truckModel: {
      type: String,
      required: true,
      trim: true,
    },
    truckBrandId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckBrandModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.TruckModelModel,
    versionKey: false,
    timestamps: true,
  }
);
let subCategory = mongoose.model(constants.TruckModelModel, truckModelSchema);
module.exports = subCategory;
