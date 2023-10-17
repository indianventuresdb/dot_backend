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
});

const CouponCode = mongoose.model("CouponCode", CouponCodeSchema);

module.exports = CouponCode;
