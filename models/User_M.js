var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
            required: [true, "Please enter mobile."]
        },
        password: {
            type: String,
            // required: [true, "Please enter Password."]
        },
        Otp: {
            type: Number,
            required: true
        },
        OtpsendDate: {
            type: Date,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        userType: {
            type: String,
            enum: ['1', '2'],
            required:true
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
        collection: constants.UserModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

usersSchema.index({ location: "2dsphere" });
usersSchema.index({ 'createdAt': -1 });

// function avatarGetter(avatar) {
//     if (avatar) {
//         return process.env.WEBURL + '/' + avatar;
//     } else {
//         return process.env.WEBURL + '/images/user2-160x160.jpg';
//     }
// }

mongoose.model(constants.UserModel, usersSchema);
