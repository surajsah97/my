var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { randomUUID } = require("crypto");

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
      default: 0,
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
      default: false,
    },
    activeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    pauseresumeDate: {
      type: [
        {
          pauseDate: {
            type: Date,
            // default: Date.now,
          },
          resumeDate: {
            type: Date,
            // default:Date.now
          },
        },
      ],
    },
    // lastActiveDate:{
    //   type:Number
    // },
    // lastPauseDate:{
    //   type:Number
    // },
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
    collection: constants.UserSubscriptionModel,
    versionKey: false,
    timestamps: true,
    // toJSON: { virtuals: true, getters: true }
  }
);

// productSchema.index({ 'createdAt': -1 });

mongoose.model(constants.UserSubscriptionModel, productSchema);

/** */
// const subDuration = await subscriptionPlanModel
//   .findById({ _id: new ObjectId(find_subscription.subDurationId) })
//   .select("planDuration");
// console.log(subDuration.planDuration, "............subduration");

// if (!subDuration) {
//   const err = new customError(
//     global.CONFIGS.api.subscriptionPlanNotfound,
//     global.CONFIGS.responseCode.notFound
//   );
//   return next(err);
// }
// // let differencesInDays;
// let differencesInDays = find_subscription.pauseresumeDate.map(entry => {
//   const pauseDate = new Date(entry.pauseDate);
//   const resumeDate = new Date(entry.resumeDate);
//   const differenceInMilliseconds = resumeDate - pauseDate;
//   return differenceInMilliseconds / (1000 * 3600 * 24);
// });

// console.log("Differences in days for each entry:", differencesInDays);

// const resumeDate = find_subscription.pauseresumeDate.map((entry) => {
//   let resumeDate = new Date(entry.resumeDate);
//   return resumeDate.setDate(resumeDate.getDate());
// });
// const pauseDate = find_subscription.pauseresumeDate.map((entry) => {
//   let pauseDate = new Date(entry.pauseDate);
//   return pauseDate.setDate(pauseDate.getDate());
// });
// console.log(pauseDate[0],"........qqqq");
// let currentDate = new Date(pauseDate[0]);
// currentDate.setDate(currentDate.getDate() );
// console.log(currentDate,"......currentDate");
// // differencesInDays = subDuration.planDuration
// let calendar = find_subscription.calendar;
// console.log(calendar, "......calendar");
// const filteredCalendar = calendar.filter(item => item.deliveryStatus === true);
// console.log(filteredCalendar, ".......filteredCalendar");
// console.log(filteredCalendar.length, ".......filteredCalendar.length");
// console.log(calendar.length, ".......calendar.length");
// // return;
// const productId = calendar.map(item => item.productId);
// console.log(productId, ".......productId");
// let lengthOfDifferencesInDays=Math.floor(differencesInDays[0]);
// console.log(lengthOfDifferencesInDays,".......lengthOfDifferencesInDays")
// for (let i = 0; i <lengthOfDifferencesInDays ; i++) {
//   let currentDate = new Date(pauseDate[0]);
//   currentDate.setDate(currentDate.getDate());
//   let obj = {};
//   obj.productId = new ObjectId(productId[0]);
//   obj.day = lengthOfDifferencesInDays + i + 1;
//   obj.dates = currentDate+i;
//   // obj.dates = currentDate.toISOString().slice(0, 10);
//   obj.deliveryStatus = false;
//   calendar.push(obj);
//   var updateSub = await UserSubscriptionModel.updateOne(
//     {
//       calendar: calendar,
//     })
// }

/** */
