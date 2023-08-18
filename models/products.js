const mongoose = require("mongoose");

const products = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    tax: {
      type: Number,
      default: 12,
    },
    madeIn: {
      type: String,
      default: "India",
    },
    brand: {
      type: String,
      default: "Augse",
    },
    hsnCode: {
      type: String,
    },
    isCodAllowed: {
      type: Boolean,
      required: true,
    },
    isReturnAble: {
      type: Boolean,
      required: true,
    },
    isCancelAble: {
      type: Boolean,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    offeredPrice: {
      type: Number,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    otherImage: {
      type: [String],
      required: true,
    },
    productVideo: {
      type: String,
    },
    DetailedDescription: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

exports.Products = mongoose.model("Products", products);
