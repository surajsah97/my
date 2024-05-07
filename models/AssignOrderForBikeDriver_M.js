var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AssignOrderForBikeDriverSchema = new Schema(
  {
    bikeDriverId: {
      type: Schema.Types.ObjectId,
      ref: constants.BikeDriverModel,
      required: true,
    },
    totalBottleCapacity: {
      type: Number,
      required: [true, "Please enter totalBottleCapacity."],
    },
    totalReserveCapacity: {
      type: Number,
      required: [true, "Please enter totalReserveCapacity."],
    },

    deliveredReserveBottle: {
      type: Number,
      // required: [true, "Please enter deliveredReserveBottle."],
      default: 0,
    },
    returnedReserveBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    damagedBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    leakageBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    brokenBottle: {
      type: Number,
      // required: [true, "Please enter returnedReserveBottle."],
      default: 0,
    },
    deliveryZoneId: {
      type: Schema.Types.ObjectId,
      ref: constants.DeliveryZoneModel,
      required: [true, "Please enter deliveryZoneId."],
    },
    productOrder: {
      type: [
        {
          productOrderId: {
            type: Schema.Types.ObjectId,
            ref: constants.ProductOrderModel,
            required: [true, "Please enter productOrderId."],
          },
          bottleQunatity: {
            type: Number,
          },
        },
      ],
    },
    // startDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    // endDateAndTime: {
    //   type: Date,
    //   required: [true, "Please enter startDateAndTime."],
    // },
    assignorderQrCode: {
    type: String // Store QR code data as a string
    },
    activeStatus: {
      type: String,
      enum: ["Active","AssignBytruck", "Completed"],
      default: "Active",
    },
  },
  {
    collection: constants.AssignOrderForBikeDriverModel,
    versionKey: false,
    timestamps: true,
  }
);
AssignOrderForBikeDriverSchema.pre('save', async function(next) {
  for(const order of this.productOrder) {
    const productOrderDoc = await mongoose.model(constants.ProductOrderModel).findById(order.productOrderId);
    let totalQuantity = productOrderDoc.product.reduce((acc, item) => acc + item.qty, 0);
    order.bottleQunatity = totalQuantity;
  }
  next();
});
let assignProductOrder = mongoose.model(
  constants.AssignOrderForBikeDriverModel,
  AssignOrderForBikeDriverSchema
);
module.exports = assignProductOrder;
