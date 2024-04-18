var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var vatSchema = new Schema(
  {
    vatPercentage: {
      type: Number,
      required: true,
    },
    activeStatus: {
      type: String,
      enum: ["0", "1"],
      default: "1",
    },
  },
  {
    collection: constants.VatModel,
    versionKey: false,
    timestamps: true,
  }
);
let vatModel = mongoose.model(constants.VatModel, vatSchema);
module.exports = vatModel;
