const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phone_OTP: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    adminType: {
      type: String,
      default: "customer",
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Orders",
      default: [],
    },
    address: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Address",
      default: [],
    },
    coupons: {
      type: [String], 
      default: [],
    },
    referralCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

exports.Users = mongoose.model("Users", users);
