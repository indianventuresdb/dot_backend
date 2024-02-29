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
  deleteCoupon,
} = require("./../controllers/rewards");
const { isAuthenticated } = require("../middlewares/auth");
const { taskTracking } = require("../middlewares/taskTracking");

router.get("/referral_link/me", myReferralLink);

router.get("/usedCodes/:userId", usedCodes);

router.get("/activeCodes/:userId", activeCodes);

router.get("/getDiscountPercentage", getDiscountPercentageFromCode);

router.get("/coupon/special", getSpecialCoupon);

router.post("/add/coupon", isAuthenticated, taskTracking, addCoupon);

router.post(
  "/add/coupon/special",
  isAuthenticated,
  taskTracking,
  addSpecialCoupon
);

router.delete("/coupon/:code", isAuthenticated, taskTracking, deleteCoupon);

module.exports = router;
