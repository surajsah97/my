var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var driverSchema = new Schema(
    {
        name: {
            type: String,
            required: [true,"Please enter name."]
        },
        email: {
            type: String,
            // required: [true, "Please enter email."]
        },
        mobile: {
            type: Number,
            required: [true, "Please enter mobile."]
        },
        nationality: {
            type: String,
            required: [true, "Please enter nationality."]
        },
        altMobile: {
            type: Number,
            // required: [true, "Please enter mobile."]
        },
        passportNumber: {
            type: String,
            required: [true,"Please enter passport number."]
        },
        passwordassportValidity: {
            type: Date,
            required: [true, "Please enter passport validity."]
        },
        visaNumber: {
            type: Number,
            required: [true, "Please enter visa number."]
        },
        visaValidity: {
            type: String,
            required: [true, "Please enter visa validity."]
        },
        emiratesId: {
            type: String,
            required: [true, "Please enter Emirates ID."]
        },
        emiratesIdValidity: {
            type: Date,
            required: [true, "Please enter Emirates ID Validity."]
        },
        InsuranceComp: {
            type: String,
            required: [true, "Please enter Insurance Comp."]
        },
        insuranceValidity: {
            type: String,
            required: [true, "Please enter Insurance Validity."]
        },
        password: {
            type: String,
            required: [true, "Please enter Password."]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        driverType: {
            type: String,
            enum: [ 'Bike', 'Truck'],
            required: true
            // default: '1'
        }, location: {
            type: { type: String },
            coordinates: [],
        },
        activeStatus: {
            type: String,
            enum: ['0', '1', '2'],
            default: '1'
        }
    },
    {
        collection: constants.DriverModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

driverSchema.index({ location: "2dsphere" });
driverSchema.index({ 'createdAt': -1 });


mongoose.model(constants.DriverModel, driverSchema);
