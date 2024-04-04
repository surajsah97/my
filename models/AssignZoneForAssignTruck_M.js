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
    totalStock: {
      type: Number,
      default: 0,
    },
    deliverdStock: {
      type: Number,
      default: 0,
    },
    returnedStock: {
      type: Number,
      default: 0,
    },
    damagedStock: {
      type: Number,
      default: 0,
    },
    deliveryZone: {
      type: [
        {
          deliveryZoneId: {
            type: Schema.Types.ObjectId,
            ref: constants.DeliveryZoneModel,
            required: [true, "Please enter deliveryZoneId."],
          },
          stock: {
            type: Number,
            default: 0,
          },
          startDateAndTime: {
            type: Date,
            required: [true, "Please enter startDateAndTime."],
          },
          endDateAndTime: {
            type: Date,
            required: [true, "Please enter startDateAndTime."],
          },
          timeDifferenceMinutes:{
            type: Number,
            required: [true, "Please enter timeDifferenceMinutes."],
          },
        },
      ],
    },
    /**old start*/
    // startDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    // endDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    // timeDifferenceMinutes:{
    // type: Number,
    // required: [true, "Please enter timeDifferenceMinutes."],
    // },
    /**old end*/
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
