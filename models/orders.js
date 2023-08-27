const mongoose = require("mongoose");

const orders = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Products",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    productCost: {
      type: [Number],
      required: true,
    },
    quantity: {
      type: [Number],
      required: true,
    },
    productName: {
      type: [String],
      required: true,
    },
    invoiceFileName: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    payment_successful: {
      type: Boolean,
      default: false,
    },
    isOnTheWay: {
      type: Boolean,
      default: false,
    },
    way: {
      type: [String],
      default: [],
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Orders = mongoose.model("Orders", orders);
