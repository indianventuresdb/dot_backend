const mongoose = require("mongoose");

const SpecialCouponCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    default: 5,
  },
  used: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users",
    default: [],
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

exports.SpecialCouponCode = mongoose.model(
  "SpecialCouponCode",
  SpecialCouponCodeSchema
);
