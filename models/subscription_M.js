var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: constants.CategoryModel,
            required: [true, "Please enter categoryId."]
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: constants.SubCategoryModel,
            required: [true, "Please enter subCategoryId."]
        },
        productName: {
            type: String,
            required: [true, "Please enter product name."]
        },
        productImage: {
            type: String,
            required: [true, "Please enter product image."]
        },
        productPrice: {
            type: Number,
            required: [true, "Please enter product product price."]
        },
        productUOM: {
            type: String,
            required: [true, "Please enter product product UOM."]
        },
        productDes: {
            type: String,
            required: [true, "Please enter product product description."]
        },
        productInventory: {
            type: String,
            required: [true, "Please enter product product Inventory."]
        },
        activeStatus: {
            type: String,
            enum: ['0', '1', '2'],
            default: '1'
        }
    },
    {
        collection: constants.ProductModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

productSchema.index({ 'createdAt': -1 });

mongoose.model(constants.ProductModel, productSchema);
