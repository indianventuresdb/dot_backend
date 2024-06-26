const { SpecialCouponCode } = require("../models/specialCouponCode");

const verifySpecialCouponAuthorization = async (userId, code) => {
  try {
    const coupon = await SpecialCouponCode.findOne({ code: code });
    if (!coupon || coupon.used.includes(userId)) {
      return false;
    }
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return false;
    }
    return {
      discountPercentage: coupon.discountPercentage,
      minPrice: coupon.minPrice,
    };
  } catch (error) {
    return false;
  }
};

module.exports = { verifySpecialCouponAuthorization };
