var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var truckDriverSchema = new Schema(
    {
        name: {
            type: String,
            required: [true,"Please enter name."]
        },
        email: {
            type: String,
            // required: [true, "Please enter email."]
        },
        password: {
            type: String,
            required: [true, "Please enter Password."]
        },
        mobile: {
            type: Number,
            required: [true, "Please enter mobile."]
        },
        Otp: {
            type: Number,
        },
        OtpsendDate: {
            type: Date,
        },
        altMobile: {
            type: Number,
            // required: [true, "Please enter mobile."]
        },
        nationality: {
            type: String,
            required: [true, "Please enter nationality."]
        },
        passportNumber: {
            type: String,
            required: [true,"Please enter passport number."]
        },
        passportValidity: {
            type: Date,
            required: [true, "Please enter passport validity."]
        },
        visaNumber: {
            type: Number,
            required: [true, "Please enter visa number."]
        },
        visaValidity: {
            type: Date,
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
            type: Date,
            required: [true, "Please enter Insurance Validity."]
        },
        licenseNumber: {
            type: String,
            required: [true, "Please enter License Number."]
        },
        licenseCity: {
            type: String,
            required: [true, "Please enter License Issuance City."]
        },
        licenseType: {
            type: String,
            required: [true, "Please enter License Type."]
        },
        licenseValidity: {
            type: Date,
            required: [true, "Please enter License Validity."]
        },
        addressId: {
            type: Schema.Types.ObjectId,
            ref: constants.TruckDriverAddressModel,
            // required: [true, "Please enter addressId."]
        },
        bankDetailsId: {
            type: Schema.Types.ObjectId,
            ref: constants.TruckDriverBankDetailsModel,
            // required: [true, "Please enter bankDetailsId."]
        },
        docId: {
            type: Schema.Types.ObjectId,
            ref: constants.TruckDriverDocModel,
            // required: [true, "Please enter docId."]
        },
        isVerified: {
            type: Boolean,
            default: true
        },
        driverType: {
            type: String,
            enum: ['Truck'],
            default: 'Truck'
        },
        // location: {
        //     type: {
        //         type: String, 
        //         enum: ['Point'], 
        //         required: true
        //     },
        //     coordinates: {
        //         type: [Number],
        //         required: true
        //     }
        // },
        // lat: {
        //     type: Number,
        //     required:true
        // },
        // long: {
        //     type: Number,
        //     required: true
        // },
        activeStatus: {
            type: String,
            enum: ['0', '1', '2'],
            default: '1'
        }
    },
    {
        collection: constants.TruckDriverModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

truckDriverSchema.index({ location: "2dsphere" });
truckDriverSchema.index({ 'createdAt': -1 });


mongoose.model(constants.TruckDriverModel, truckDriverSchema);
