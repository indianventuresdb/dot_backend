const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    name: {
      type: String,
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
      trim: true,
    },
    password: {
      type: String,
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
    referralCode: {
      type: String,
      unique: true,
    },
    referredUsers: {
      type: Number,
      default: 0,
    },
    totalCoupon: {
      type: Number,
      default: 0,
    },
    activeCouponCode: {
      type: [String],
      default: [],
    },
    usedCoupon: {
      type: [
        {
          couponName: {
            type: String,
            required: true,
          },
          usageTimestamp: {
            type: String,
            required: true,
          },
        },
      ],
    },
    referredBy: {
      type: String,
      default: null,
    },
    firstShoppingDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Users = mongoose.model("Users", users);
