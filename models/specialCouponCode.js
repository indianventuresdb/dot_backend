const mongoose = require("mongoose");

const SpecialCouponCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 5,
  },
  used: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  expiryDate: {
    type: Date,
    default: "",
  },
  minPrice: {
    type: Number,
    default: 3000,
  },
  otherValidations: {
    type: [String],
    default: [],
  },
});

exports.CouponCode = mongoose.model(
  "SpecialCouponCode",
  SpecialCouponCodeSchema
);
