var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DriverDocSchema = new Schema(
  {
    passportImg: {
      type: {
        frontImg: {
          type: String,
          required: [true, "Please enter passport front Image."],
        },
        backImg: {
          type: String,
          required: [true, "Please enter passport back Image."],
        },
      },
    },
    emiratesIdImg: {
      type: {
        frontImg: {
          type: String,
          required: [true, "Please enter emirates Id front Image."],
        },
        backImg: {
          type: String,
          required: [true, "Please enter emirates Id back Image."],
        },
      },
    },
    licenseImg: {
      type: {
        frontImg: {
          type: String,
          required: [true, "Please enter license front Image."],
        },
        backImg: {
          type: String,
          required: [true, "Please enter license back Image."],
        },
      },
    },
    visaImg: {
      type: String,
      required: [true, "Please enter visa Image."],
    },
    driverImg: {
      type: String,
      required: [true, "Please enter driver Image."],
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: constants.BikeDriverModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.DriverDocModel,
    versionKey: false,
    // autoIndex: false,
    timestamps: true,
  }
);
let address = mongoose.model(constants.DriverDocModel, DriverDocSchema);
module.exports = address;