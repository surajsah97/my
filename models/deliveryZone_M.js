var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DeliverZoneSchema = new Schema(
  {
    zoneName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
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
    collection: constants.DeliveryZoneModel,
    versionKey: false,
    timestamps: true,
  }
);
// DeliverZoneSchema.index({ location: "2dsphere" });
let deliveryzone = mongoose.model(
  constants.DeliveryZoneModel,
  DeliverZoneSchema
);
module.exports = deliveryzone;
