var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var subCategorySchema = new Schema(
    {
        subCategory: {
            type: String,
            require: true
        },
        categoryId: {
            type: String,
            require: true
        },
        activeStatus: {
            type: String,
            enum: ['0', '1'],
            default: '1'
        }
    },
    {
        collection: constants.SubCategoryModel,
        versionKey: false,
        // autoIndex: false,
        timestamps: true
    }
);
let subCategory = mongoose.model(constants.SubCategoryModel, subCategorySchema);
module.exports = subCategory;