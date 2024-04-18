var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TruckDriverAddressSchema = new Schema(
  {
    localAddress: {
      type: {
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
        street: {
          type: String,
          required: true,
          trim: true,
        },
        landmark: {
          type: String,
          required: true,
          trim: true,
        },
      },
    },
    homeCountryAddress: {
      type: {
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
        street: {
          type: String,
          required: true,
          trim: true,
        },
        landmark: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        pinCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
    },
    emergencyContact: {
      type: {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        relation: {
          type: String,
          required: true,
          trim: true,
        },
        mobile: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckDriverModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.TruckDriverAddressModel,
    versionKey: false,
    // autoIndex: false,
    timestamps: true,
  }
);
let address = mongoose.model(
  constants.TruckDriverAddressModel,
  TruckDriverAddressSchema
);
module.exports = address;
