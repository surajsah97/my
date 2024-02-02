var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserAddressSchema = new Schema(
    {
        houseNo: {
            type: String,
            required: true,
            trim: true
        },
        buildingName: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        landmark: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: constants.DriverModel,
            required: true
        },
        activeStatus: {
            type: String,
            enum: ['0', '1'],
            default: '1'
        }
    },
    {
        collection: constants.UserAddressModel,
        versionKey: false,
        // autoIndex: false,
        timestamps: true
    }
);
let address = mongoose.model(constants.UserAddressModel, UserAddressSchema);
module.exports = address;