var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var assignTruckForDriverSchema = new Schema(
  {
    truckId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckDetailModel,
      required: true,
    },
    truckDriverId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckDriverModel,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1","2"],
      default: "1",
    },
  },
  {
    collection: constants.AssignTruckForDriverModel,
    versionKey: false,
    timestamps: true,
  }
);
let assignTruck = mongoose.model(
  constants.AssignTruckForDriverModel,
  assignTruckForDriverSchema
);
module.exports = assignTruck;
