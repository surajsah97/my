var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TruckDriverBankDetailsSchema = new Schema(
    {
        bankName: {
            type: String,
            required: true,
            trim: true
        },
        branchName: {
            type: String,
            required: true,
            trim: true
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true
        },
        accountHolderName: {
            type: String,
            required: true,
            trim: true
        },
        IBAN: {
            type: String,
            required: true,
            trim: true
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: constants.TruckDriverModel,
            required: true
        },
        activeStatus: {
            type: String,
            enum: ['0', '1'],
            default: '1'
        }
    },
    {
        collection: constants.TruckDriverBankDetailsModel,
        versionKey: false,
        // autoIndex: false,
        timestamps: true
    }
);
let address = mongoose.model(constants.TruckDriverBankDetailsModel, TruckDriverBankDetailsSchema);
module.exports = address;