var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var deliveryLocationSchema = new Schema(
  {
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryZoneId: {
      type: Schema.Types.ObjectId,
      ref: constants.DeliveryZoneModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
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
