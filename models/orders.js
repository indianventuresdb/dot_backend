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
    acutalPrice: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
    providerReferenceId: {
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
    cancelled: {
      type: Boolean,
      default: false,
    },
    awb: {
      type: String,
      default: "",
    },
    wayBill: {
      type: String,
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
    isReturnable: {
      type: Boolean,
      required: true,
    },
    isCancelable: {
      type: Boolean,
      required: true,
    },
    couponCodeUsed: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

exports.Orders = mongoose.model("Orders", orders);
