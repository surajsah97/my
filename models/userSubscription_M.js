var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { randomUUID } = require('crypto'); 

var productSchema = new Schema(
  {
    subscriptionId: {
      type: String,
      default: randomUUID(),
    },
    transactionId: {
      type: String,
      // ref: "Payment",
      // required: true,
      default:0
    },
    pauseresumeDate:{
       type: [
        {
          pauseDate: {
            type: Date,
          },
          resumeDate: {
            type: Date,
          },
        },
      ],
    },
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
          },productPrice: {
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
    addressId: {
      type: Schema.Types.ObjectId,
      ref: constants.UserAddressModel,
      required: [true, "Please enter addressId."],
    },
    subDurationId: {
      type: Schema.Types.ObjectId,
      ref: constants.subscriptionPlanModel,
      required: [true, "Please enter subDurationId."],
    },
    paymentStatus: {
      type: Boolean,
      default:false
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
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
    endDate: {
      type: Date,
      required: [true, "Please enter endDat."],
    },
    startDate: {
      type: Date,
      required: [true, "Please enter startDate."],
    },
    leftDuration:{
      type:Number,
      required: [true, "Please enter leftDuration."],
    },
    calendar:{
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
          deliveryStatus:{
            type:Boolean,
            // default:false
          }
        },
      ],

    },
    dailyInterval: {
      type: String,
      enum: ["daily", "alternate"],
    },
  },
  {
    collection: constants.UserSubscriptionModel,
    versionKey: false,
    timestamps: true,
    // toJSON: { virtuals: true, getters: true }
  }
);

// productSchema.index({ 'createdAt': -1 });

mongoose.model(constants.UserSubscriptionModel, productSchema);
