var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var deliveryLocationSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    collection: constants.DeliveryLocationModel,
    versionKey: false,
    timestamps: true,
  }
);
let DeliveryLocation_cms = mongoose.model(
  constants.DeliveryLocationModel,
  deliveryLocationSchema
);
module.exports = DeliveryLocation_cms;
