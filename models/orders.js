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
    productImage: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Order Placed",
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
    order_placed: {
      type: String,
    },
    packed: {
      type: String,
    },
    outForDelivery: {
      type: String,
    },
    shipped: {
      type: String,
    },
    awb: {
      type: String,
      default: "",
    },
    expectedDelivery: {
      type: String,
      default: new Date(new Date() + 1000 * 60 * 60 * 24 * 7),
    },
    delivered: {
      type: String,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    paymentMode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

exports.Orders = mongoose.model("Orders", orders);
