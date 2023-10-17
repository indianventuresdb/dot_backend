const { Users } = require("../models/users");

const verifyCouponAuthorization = async (userId, couponCode) => {
  try {
    const user = await Users.findById(userId);
    if (user) {
      const isAuthorized = user.activeCouponCode.includes(couponCode);
      return isAuthorized;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = { verifyCouponAuthorization };
