var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserAddressSchema = new Schema(
  {
    houseNo: {
      type: String,
      required: true,
      trim: true,
    },
    buildingName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
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
    collection: constants.UserAddressModel,
    versionKey: false,
    // autoIndex: false,
    timestamps: true,
  }
);
UserAddressSchema.index({ location: "2dsphere" });
let address = mongoose.model(constants.UserAddressModel, UserAddressSchema);
module.exports = address;
