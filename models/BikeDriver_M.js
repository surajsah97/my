var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bikeDriverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name."],
    },
    email: {
      type: String,
      // required: [true, "Please enter email."]
    },
    password: {
      type: String,
      required: [true, "Please enter Password."],
    },
    mobile: {
      type: Number,
      required: [true, "Please enter mobile."],
    },
    altMobile: {
      type: Number,
      // required: [true, "Please enter mobile."]
    },
    Otp: {
      type: Number,
    },
    OtpsendDate: {
      type: Date,
    },
    nationality: {
      type: String,
      required: [true, "Please enter nationality."],
    },
    passportNumber: {
      type: String,
      required: [true, "Please enter passport number."],
    },
    passportValidity: {
      type: Date,
      required: [true, "Please enter passport validity."],
    },
    visaNumber: {
      type: Number,
      required: [true, "Please enter visa number."],
    },
    visaValidity: {
      type: Date,
      required: [true, "Please enter visa validity."],
    },
    emiratesId: {
      type: String,
      required: [true, "Please enter Emirates ID."],
    },
    emiratesIdValidity: {
      type: Date,
      required: [true, "Please enter Emirates ID Validity."],
    },
    InsuranceComp: {
      type: String,
      required: [true, "Please enter Insurance Comp."],
    },
    insuranceValidity: {
      type: Date,
      required: [true, "Please enter Insurance Validity."],
    },
    licenseNumber: {
      type: String,
      required: [true, "Please enter License Number."],
    },
    licenseCity: {
      type: String,
      required: [true, "Please enter License Issuance City."],
    },
    licenseType: {
      type: String,
      required: [true, "Please enter License Type."],
    },
    licenseValidity: {
      type: Date,
      required: [true, "Please enter License Validity."],
    },
    docId: {
      type: Schema.Types.ObjectId,
      ref: constants.DriverDocModel,
      // required: [true, "Please enter Insurance Validity."]
    },
    bikeDetailsId: {
      type: Schema.Types.ObjectId,
      ref: constants.BikeModel,
      // required: [true, "Please enter bikeModelId validity."]
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: constants.DriverAddressModel,
      // required: [true, "Please enter Insurance Validity."]
    },
    bankDetailsId: {
      type: Schema.Types.ObjectId,
      ref: constants.DriverBankDetailsModel,
      // required: [true, "Please enter Insurance Validity."]
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    driverType: {
      type: String,
      enum: ["Bike"],
      default: "Bike",
    },
    location: {
      type: {
        type: String, 
        enum: ["Point"], 
        // required: true,
      },
      coordinates: {
        type: [Number],
        // required: true,
      },
    },
    lat: {
      type: Number,
      // required:true
    },
    long: {
      type: Number,
      // required: true
    },

    activeStatus: {
      type: String,
      enum: ["0", "1", "2"],
      default: "1",
    },
  },
  {
    collection: constants.BikeDriverModel,
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

bikeDriverSchema.index({ location: "2dsphere" });
bikeDriverSchema.index({ createdAt: -1 });
mongoose.model(constants.BikeDriverModel, bikeDriverSchema);
