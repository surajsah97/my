var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var assignZoneForAssignTruckSchema = new Schema(
  {
    assignTruckId: {
      type: Schema.Types.ObjectId,
      ref: constants.AssignTruckForDriverModel,
      required: true,
    },
    totalTruckCapacity: {
      type: Number,
      required: [true, "Please enter totalTruckCapacity."],
    },
    totalReserveCapacity: {
      type: Number,
      required: [true, "Please enter totalReserveCapacity."],
    },
    
    deliveredReserveBottle: {
      type: Number,
      required: [true, "Please enter deliveredReserveBottle."],
    },
    returnedReserveBottle: {
      type: Number,
      required: [true, "Please enter returnedReserveBottle."],
    },
    damagedBottle: {
      type: Number,
      // default:0
      required: [true, "Please enter damagedBottle."],
    },
    leakageBottle: {
      type: Number,
      required: [true, "Please enter leakageBottle."],
    },
    brokenBottle: {
      type: Number,
      required: [true, "Please enter brokenBottle."],
    },
    deliveryZone: {
      type: [
        {
          deliveryZoneId: {
            type: Schema.Types.ObjectId,
            ref: constants.DeliveryZoneModel,
            required: [true, "Please enter deliveryZoneId."],
          },
          zoneStock: {
            type: Number,
            default: 0,
          },

    /**old start*/
        //   startDateAndTime: {
        //     type: Date,
        //     required: [true, "Please enter startDateAndTime."],
        //   },
        //   endDateAndTime: {
        //     type: Date,
        //     required: [true, "Please enter startDateAndTime."],
        //   },
        //   timeDifferenceMinutes:{
        //     type: Number,
        //     required: [true, "Please enter timeDifferenceMinutes."],
        //   },
    /**old end*/
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
    // timeDifferenceMinutes:{
    // type: Number,
    // required: [true, "Please enter timeDifferenceMinutes."],
    // },
    activeStatus: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  {
    collection: constants.AssignZoneForAssignTruckModel,
    versionKey: false,
    timestamps: true,
  }
);
let assignTruck = mongoose.model(
  constants.AssignZoneForAssignTruckModel,
  assignZoneForAssignTruckSchema
);
module.exports = assignTruck;
