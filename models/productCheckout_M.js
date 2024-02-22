var constants = require("./modelConstants");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
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
          categoryId: {
            type: Schema.Types.ObjectId,
            ref: constants.CategoryModel,
            // required: [true, "Please enter categoryId."]
          },
          subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: constants.SubCategoryModel,
            // required: [true, "Please enter subCategoryId."]
          },
          productUOM: {
            type: String,
            // required: [true, "Please enter product product UOM."]
          },
          productDes: {
            type: String,
            // required: [true, "Please enter product product description."]
          },
          productInventory: {
            type: String,
            // required: [true, "Please enter product product Inventory."]
          },
        },
      ],
    },
    totalPrice: {
      type: Number,
      required: [true, "Please enter price."],
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
