var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tempProductCheckoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserModel,
      required: [true, "Please enter userId."],
    },
    product: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: constants.ProductModel,
            required: [true, "Please enter productId."],
          },
          productName: {
            type: String,
          },
          productPrice: {
            type: Number,
          },
          productImage: {
            type: String,
          },
          quantity: {
        type: Number,
        min: [1, "Quantity cannot be less than 1"],
        default: 1,
      },
         
          productUOM: {
            type: String,
            
          },
        
          productInventory: {
            type: String,
            
          },
        },
      ],
    },
    totalPrice: {
      type: Number,
      // required: [true, "Please enter price."],
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
  },
  {
    collection: constants.TempProductCheckOutModel,
    versionKey: false,
    timestamps: true,
  }
);

tempProductCheckoutSchema.index({ createdAt: -1 });

mongoose.model(constants.TempProductCheckOutModel, tempProductCheckoutSchema);
