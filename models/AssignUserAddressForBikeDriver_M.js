var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AssignUserAddressForBikeDriverSchema = new Schema(
  {
    bikeDriverId: {
      type: Schema.Types.ObjectId,
      ref: constants.BikeDriverModel,
      required: true,
    },
    totalBottleCapacity: {
      type: Number,
      required: [true, "Please enter totalBottleCapacity."],
    },
    totalReserveCapacity: {
      type: Number,
      required: [true, "Please enter totalReserveCapacity."],
    },

    deliveredReserveBottle: {
      type: Number,
      // required: [true, "Please enter deliveredReserveBottle."],
      default: 0,
    },
    returnedReserveBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    damagedBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    leakageBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    brokenBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    deliveryAddress: {
      type: [
        {
          deliveryAddressId: {
            type: Schema.Types.ObjectId,
            ref: constants.UserAddressModel,
            required: [true, "Please enter deliveryAddressId."],
          },
          bottleQunatity: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    startDateAndTime: {
      type: Date,
      required: [true, "Please enter startDateAndTime."],
    },
    endDateAndTime: {
      type: Date,
      required: [true, "Please enter startDateAndTime."],
    },

    activeStatus: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  {
    collection: constants.AssignUserAddressForBikeDriverModel,
    versionKey: false,
    timestamps: true,
  }
);
let assignUserAddress = mongoose.model(
  constants.AssignUserAddressForBikeDriverModel,
  AssignUserAddressForBikeDriverSchema
);
module.exports = assignUserAddress;
