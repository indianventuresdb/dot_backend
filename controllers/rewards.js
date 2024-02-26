const { Users } = require("./../models/users");
const { CouponCode } = require("./../models/couponCode");
const { SpecialCouponCode } = require("./../models/specialCouponCode");
const { encryptReferralCode } = require("./../utils/referralcode");
const { verifyCouponAuthorization } = require("./../utils/couponAuth");
const {
  verifySpecialCouponAuthorization,
} = require("../utils/verifySpecialCouponAuthorization");

const myReferralLink = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await Users.findById(userId);
    const referralCode = user.referralCode || encryptReferralCode(userId);
    user.referralCode = referralCode;
    await user.save();
    res.status(201).json({
      link: `https://www.augse.in/signup?referral=${referralCode}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const usedCodes = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Users.findById(userId);
    if (user) {
      res.status(200).json({ usedCodes: user.usedCoupon });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const activeCodes = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Users.findById(userId);
    if (user) {
      res.status(200).json({ activeCodes: user.activeCouponCode });
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDiscountPercentageFromCode = async (req, res) => {
  const { code, userId } = req.query;
  try {
    const verified = await verifyCouponAuthorization(userId, code);
    if (verified) {
      const coupon = await CouponCode.findOne({ code: code });
      if (coupon) {
        const discountPercentage = coupon.discountPercentage;
        res
          .status(200)
          .json({ message: "Verified", coupon: code, discountPercentage });
      } else {
        res.status(404).json({ message: "Coupon not found" });
      }
    } else {
      const verifySpecial = await verifySpecialCouponAuthorization(
        userId,
        code
      );
      if (verifySpecial) {
        return res.status(200).json({
          message: "Verified",
          coupon: code,
          discountPercentage: verifySpecial,
        });
      }
      res.status(403).json({ message: "Not Authorized to use this code" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addCoupon = async (req, res) => {
  const { code, tier, discountPercentage, description } = req.body;
  try {
    const existingCoupon = await CouponCode.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    const newCoupon = new CouponCode({
      code,
      tier,
      discountPercentage,
      description,
    });
    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon added successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addSpecialCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      description,
      expiryDate,
      minPrice,
      otherValidations,
      validationRules,
    } = req.body;

    const adjustedExpiryDate = new Date(expiryDate);
    adjustedExpiryDate.setHours(23, 59, 59, 999);

    const newCoupon = new SpecialCouponCode({
      code,
      discountPercentage,
      description,
      expiryDate: adjustedExpiryDate,
      minPrice,
      otherValidations,
      validationRules,
    });

    const savedCoupon = await newCoupon.save();

    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecialCoupon = async (req, res) => {
  try {
    const coupon = await SpecialCouponCode.find();
    res.status(200).json({ coupons: coupon });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    await SpecialCouponCode.findOneAndDelete({ code: code });
    res.status(201).json({ message: "Coupon Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  myReferralLink,
  usedCodes,
  activeCodes,
  getDiscountPercentageFromCode,
  addCoupon,
  addSpecialCoupon,
  getSpecialCoupon,
  deleteCoupon,
};
