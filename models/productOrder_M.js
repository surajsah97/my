var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var constants = require("./modelConstants");

var productOrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserModel,
      required: [true, "Please enter userId."],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: constants.ProductModel,
          required: [true, "Please enter productId."],
        },
        productPrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          min: [1, "Quantity cannot be less than 1"],
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      //   required: [true, "Please enter totalPrice."],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    collection: constants.ProductOrderModel,
    versionKey: false,
    timestamps: true,
  }
);

productOrderSchema.index({ createdAt: -1 });
mongoose.model(constants.ProductOrderModel, productOrderSchema);
