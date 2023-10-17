const { Users } = require("./../models/users");
const { encryptReferralCode } = require("./../utils/referralcode");

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { myReferralLink, usedCodes, activeCodes };
