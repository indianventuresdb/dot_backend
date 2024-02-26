const express = require("express");
const router = express.Router();

const {
  myReferralLink,
  usedCodes,
  activeCodes,
  getDiscountPercentageFromCode,
  addCoupon,
  addSpecialCoupon,
  getSpecialCoupon,
  deleteCoupon
} = require("./../controllers/rewards");

router.get("/referral_link/me", myReferralLink);

router.get("/usedCodes/:userId", usedCodes);

router.get("/activeCodes/:userId", activeCodes);

router.get("/getDiscountPercentage", getDiscountPercentageFromCode);

router.post("/add/coupon", addCoupon);

router.post("/add/coupon/special", addSpecialCoupon);

router.get("/coupon/special", getSpecialCoupon);

router.delete("/coupon/:code", deleteCoupon);

module.exports = router;
