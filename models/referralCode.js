const mongoose = require("mongoose");

const CouponCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CouponCode = mongoose.model("CouponCode", CouponCodeSchema);

module.exports = CouponCode;
