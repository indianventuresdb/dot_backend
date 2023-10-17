const express = require("express");
const router = express.Router();

const { myReferralLink } = require("./../controllers/rewards");

router.get("/referral_link/me", myReferralLink);

module.exports = router;
