var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AssignBikeDriverForAssigntruckSchema = new Schema(
  {
    assigntruckId: {
      type: Schema.Types.ObjectId,
      ref: constants.AssignTruckForDriverModel,
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
    deliveryZoneId: {
      type: Schema.Types.ObjectId,
      ref: constants.DeliveryZoneModel,
      required: [true, "Please enter deliveryZoneId."],
    },
    bikeDriver: {
      type: [
        {
          bikeDriverId: {
            type: Schema.Types.ObjectId,
            ref: constants.BikeDriverModel,
            required: [true, "Please enter deliveryAddressId."],
          },
          // bottleQunatity: {
          //   type: Number,
          //   default: 0,
          // },
        },
      ],
    },
    assignOrderbikeDriver: {
      type: [
        {
          assignOrderbikeDriverId: {
            type: Schema.Types.ObjectId,
            ref: constants.AssignOrderForBikeDriverModel,
            required: [true, "Please enter assignOrderbikeDriverId."],
          },
          bottleQunatity: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    // startDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    // endDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    assignbikedriverQrCode: {
    type: String // Store QR code data as a string
    },
    activeStatus: {
      type: String,
      enum: ["Active", "AssignByAdmin","Completed"],
      default: "Active",
    },
  },
  {
    collection: constants.AssignBikeDriverForAssigntruckModel,
    versionKey: false,
    timestamps: true,
  }
);
let assignBikeDriverForassigntruck = mongoose.model(
  constants.AssignBikeDriverForAssigntruckModel,
  AssignBikeDriverForAssigntruckSchema
);
module.exports = assignBikeDriverForassigntruck;
