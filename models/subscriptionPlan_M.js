var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscriptionPlanSchema = new Schema(
    {
        planDuration: {
            type: Number,
            enum: [1, 3, 6, 9, 12],
            required: [true, "Please enter plan duration."],
            trim: true
        },
        activeStatus: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        }
    },
    {
        collection: constants.subscriptionPlanModel,
        versionKey: false,
        timestamps: true
    }
);
let subscriptionPlan_cms = mongoose.model(constants.subscriptionPlanModel, subscriptionPlanSchema);
module.exports = subscriptionPlan_cms;