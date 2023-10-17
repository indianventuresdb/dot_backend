const express = require("express");
const router = express.Router();

const {
  myReferralLink,
  usedCodes,
  activeCodes,
  getDiscountPercentageFromCode,
  addCoupon,
} = require("./../controllers/rewards");

router.get("/referral_link/me", myReferralLink);

router.get("/usedCodes/:userId", usedCodes);

router.get("/activeCodes/:userId", activeCodes);

router.get("/getDiscountPercentage", getDiscountPercentageFromCode);

router.post("/add/coupon", addCoupon);

module.exports = router;
