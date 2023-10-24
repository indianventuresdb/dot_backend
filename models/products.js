const mongoose = require("mongoose");

const products = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tax: {
      type: Number,
      default: 12,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
    },
    discount: {
      type: Number,
      required: true,
    },
    madeIn: {
      type: String,
      default: "India",
    },
    brand: {
      type: String,
      default: "Augse",
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
    otherImages: {
      type: [String],
    },
    productVideo: {
      type: String,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    visibility: {
      type: Boolean,
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
