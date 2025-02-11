var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// var moment = require('moment');
var usersSchema = new Schema(
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
    // location: {
    //     type: { type: String },
    //     coordinates: [],
    // },
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
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: constants.UserModel,
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

// usersSchema.index({ location: "2dsphere" });

// usersSchema.virtual('formattedDOB').get(function() {
//     if (this.DOB) {
//         return moment(this.DOB).format('DD-MM-YYYY');
//     }
//     return '';
// });

usersSchema.index({ createdAt: -1 });

mongoose.model(constants.UserModel, usersSchema);
