var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var checkoutSchema = new Schema(
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
    subDurationId: {
      type: Schema.Types.ObjectId,
      ref: constants.subscriptionPlanModel,
      required: [true, "Please enter subDurationId."],
    },
    paymentStatus: {
      type: Boolean,
      default: false,
      // required: [true, "Please enter paymentStatus."]
    },
    totalPrice: {
      type: Number,
      required: [true, "Please enter price."],
    },
    // vatAmount: {
    //   type: Schema.Types.ObjectId,
    //   ref: constants.VatModel,
    // },
    vatAmount: {
      type: Number,
      // required: [true, "Please enter vat."],
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
    endDate: {
      type: Date,
      required: [true, "Please enter endDat."],
    },
    startDate: {
      type: Date,
      required: [true, "Please enter startDate."],
    },
    leftDuration: {
      type: Number,
      required: [true, "Please enter leftDuration."],
    },

    calendar: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: constants.ProductModel,
            // required: [true, "Please enter productId."],
          },
          day: {
            type: Number,
            required: [true, "Please enter Day."],
          },
          dates: {
            type: Date,
            required: [true, "Please enter startDate."],
          },
          deliveryStatus: {
            type: Boolean,
            // default:false
          },
        },
      ],
    },
    dailyInterval: {
      type: String,
      enum: ["daily", "alternate"],
    },
  },
  {
    collection: constants.SubscriptionCheckOutModel,
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

// productSchema.index({ 'createdAt': -1 });

mongoose.model(constants.SubscriptionCheckOutModel, checkoutSchema);
