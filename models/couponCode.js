const mongoose = require("mongoose");

const CouponCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  tier: {
    type: String,
    enum: ["Golden", "Silver"],
    default: "Silver",
  },
  discountPercentage: {
    type: Number,
    enum: [5, 10],
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
});

exports.CouponCode = mongoose.model("CouponCode", CouponCodeSchema);
