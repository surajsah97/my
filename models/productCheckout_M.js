var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var constants = require("./modelConstants");
var productCheckoutSchema = new Schema(
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
          qty: {
            type: Number,
            min: [1, "Quantity cannot be less than 1"],
            default: 1,
          },
        },
      ],
    },
    freeProduct: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: constants.ProductModel,
            required: [true, "Please enter productId."],
          },
          productPrice: {
            type: Number,
          },
          qty: {
            type: Number,
            min: [1, "Quantity cannot be less than 1"],
            default: 1,
          },
        },
      ],
    },
    totalPrice: {
      type: Number,
      required: [true, "Please enter price."],
    },
    vatAmount: {
      type: Number,
      // required: [true, "Please enter price."],
    },
    totalTaxablePrice: {
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
    collection: constants.ProductCheckOutModel,
    versionKey: false,
    timestamps: true,
  }
);

productCheckoutSchema.index({ createdAt: -1 });

mongoose.model(constants.ProductCheckOutModel, productCheckoutSchema);
