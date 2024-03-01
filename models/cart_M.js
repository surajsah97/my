var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var cartSchema = new Schema(
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
          qty: {
            type: Number,
            required: [true, "Please enter qty."],
          },
          productPrice: {
          type: Number,
        },
        },
      ],
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    price: {
      type: Number,
      required: [true, "Please enter price."],
    },
  },
  {
    collection: constants.CartModel,
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

// productSchema.index({ 'createdAt': -1 });

mongoose.model(constants.CartModel, cartSchema);
