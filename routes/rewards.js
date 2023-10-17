const express = require("express");
const router = express.Router();

const {
  myReferralLink,
  usedCodes,
  activeCodes,
} = require("./../controllers/rewards");

router.get("/referral_link/me", myReferralLink);

router.get("/usedCodes/:userId", usedCodes);

router.get("/activeCodes/:userId", activeCodes);

module.exports = router;
