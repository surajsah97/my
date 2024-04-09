var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var constants = require("./modelConstants");
const { randomUUID } = require('crypto'); 
// const { v4: uuidv4 } = require("uuid");
var productOrderSchema = new Schema(
  {
    orderId: {
      type: String,
      default: randomUUID(),
    },
    // orderId: {
    //   type: String,
    //   default: uuidv4(),
    // },
    transactionId: {
      type: String,
      // ref: "Payment",
      // required: true,
      default:0
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserModel,
      required: [true, "Please enter userId."],
    },
    product: [
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
    addressId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserAddressModel,
      required: [true, "Please enter productId."],
    },
    // totalPrice: {
    //   type: Number,
    //     required: [true, "Please enter totalPrice."],
    // },
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
    paymentstatus: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: [true, "Please enter price."],
    },
    vatAmount: {
      type: Number,
      // required: [true, "Please enter price."],
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      default: "Pending",
    },
    totalTaxablePrice: {
      type: Number,
      // required: [true, "Please enter price."],
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
