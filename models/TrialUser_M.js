var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var trialUsersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name."],
    },
    email: {
      type: String,
      required: [true, "Please enter email."],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please enter mobile."],
    },
    flatNumber: {
      type: String,
      required: [true, "Please enter flatNo."],
    },
    buildingName: {
      type: String,
      required: [true, "Please enter buildingName."],
    },
    address: {
      type: String,
      required: [true, "Please enter address."],
    },
    landmark: {
      type: String,
      // required: [true, "Please enter landmark."],
    },
    emiratesName: {
      type: String,
      default: "Dubai",
    },
    productType: {
      type: String,
      enum: ["Full Milk", "Creamy top (Malai Milk)"],
      // required:true,
      default: "Full Milk",
    },

    deliveryTime: {
      type: String,
      enum: ["6 pm to 7 pm", "7 pm to 8 pm", "8 pm to 9 pm"],
      required: true,
      // default:"6 pm to 7 pm"
    },

    userType: {
      type: String,
      default: "TrialUser",
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  {
    collection: constants.TrialUserModel,
    versionKey: false,
    timestamps: true,
    // toObject: { virtuals: true, getters: true },
    // toJSON: { virtuals: true, getters: true }
  }
);

trialUsersSchema.index({ location: "2dsphere" });
trialUsersSchema.index({ createdAt: -1 });

mongoose.model(constants.TrialUserModel, trialUsersSchema);
