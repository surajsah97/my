var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tempUsersSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true,"Please enter name."]
    },
    email: {
      type: String,
      // required: [true, "Please enter email."]
    },
    mobile: {
      type: Number,
      required: [true, "Please enter mobile."],
    },
    password: {
      type: String,
      // required: [true, "Please enter Password."]
    },
    Otp: {
      type: Number,
      required: true,
    },
    OtpsendDate: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["Admin", "User", "Guest"],
      required: true,
      // default: '1'
    },
    location: {
      type: { type: String },
      coordinates: [],
    },
    userImage: {
      type: String,
      // required: [true, "Please enter product image."]
    },
    DOB: {
      type: Date,
      // required: [true, "Please enter date of birth."]
    },
    activeStatus: {
      type: String,
      enum: ["0", "1", "2"],
      default: "1",
    },
  },
  {
    collection: constants.TempUserModel,
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

tempUsersSchema.index({ location: "2dsphere" });
tempUsersSchema.index({ createdAt: -1 });

mongoose.model(constants.TempUserModel, tempUsersSchema);
