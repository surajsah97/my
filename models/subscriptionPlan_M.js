var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subscriptionPlanSchema = new Schema(
  {
    planDuration: {
      type: Number,
      enum: [15, 30, 60, 90],
      required: [true, "Please enter plan duration."],
      trim: true,
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    collection: constants.subscriptionPlanModel,
    versionKey: false,
    timestamps: true,
  }
);
let subscriptionPlan_cms = mongoose.model(
  constants.subscriptionPlanModel,
  subscriptionPlanSchema
);
module.exports = subscriptionPlan_cms;
