var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productCheckoutSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: constants.UserModel,
            required: [true, "Please enter userId."]
        },
        product: {
            type: [{
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: constants.ProductModel,
                    required: [true, "Please enter productId."]
                }
            }]
        },
        activeStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Expired'],
            default: 'Active'
        },
    },
    {
        collection: constants.ProductCheckOutModel,
        versionKey: false,
        timestamps: true,
        
    }
);

productCheckoutSchema.index({ 'createdAt': -1 });

mongoose.model(constants.ProductCheckOutModel, productCheckoutSchema);
