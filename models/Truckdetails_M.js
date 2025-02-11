var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var truckSchema = new Schema(
  {
    truckBrandId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckBrandModel,
      required: [true, "Please enter brandId."],
    },
    truckModelId: {
      type: Schema.Types.ObjectId,
      ref: constants.TruckModelModel,
      required: [true, "Please enter modelId."],
    },
    ownerName: {
      type: String,
      required: [true, "Please enter owner name."],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Please enter vehicle number."],
    },
    registrationZone: {
      type: Number,
      required: [true, "Please enter registration zone."],
    },
    registrationDate: {
      type: Date,
      required: [true, "Please enter registration date."],
    },
    vehicleColor: {
      type: String,
      required: [true, "Please enter vehicle color."],
    },
    vehicleYear: {
      type: String,
      required: [true, "Please enter vehicle year."],
    },
    fuelType: {
      type: String,
      required: [true, "Please enter vehicle fuel type."],
    },
    vehicleAge: {
      type: Number,
      required: [true, "Please enter vehicle age."],
    },
    chasisNumber: {
      type: String,
      required: [true, "Please enter chasis number."],
    },
    insuranceValidity: {
      type: String,
      required: [true, "Please enter insurance validity."],
    },
    fitnessValidity: {
      type: String,
      required: [true, "Please enter vehicle fitness validity."],
    },
    mulkiyaValidity: {
      type: Date,
      required: [true, "Please enter vehicle mulkiya validity."],
    },
    mulkiyaDocImg: {
      type: {
        frontImg: {
          type: String,
          required: [true, "Please enter mulkiya front Image."],
        },
        backImg: {
          type: String,
          required: [true, "Please enter mulkiya back Image."],
        },
      },
    },
    vehicleImage: {
      type: {
        frontImage: {
          type: String,
          required: [true, "Please enter vehicle front Image."],
        },
        backImage: {
          type: String,
          required: [true, "Please enter vehicleback Image."],
        },
        leftImage: {
          type: String,
          required: [true, "Please enter vehicle left Image."],
        },
        rightImage: {
          type: String,
          required: [true, "Please enter vehicle right Image."],
        },
      },
    },
    activeStatus: {
      type: String,
      enum: ["0", "1", "2"],
      default: "1",
    },
  },
  {
    collection: constants.TruckDetailModel,
    versionKey: false,
    timestamps: true,
    // toObject: { virtuals: true, getters: true },
    // toJSON: { virtuals: true, getters: true }
  }
);

truckSchema.index({ createdAt: -1 });

mongoose.model(constants.TruckDetailModel, truckSchema);
