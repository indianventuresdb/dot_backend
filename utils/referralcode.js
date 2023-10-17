const crypto = require("crypto");

function encryptReferralCode(userId) {
  const secretKey = "your_secret_key";
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encryptedReferralCode = cipher.update(userId, "utf8", "hex");
  encryptedReferralCode += cipher.final("hex");
  return encryptedReferralCode;
}

function decryptReferralCode(encryptedReferralCode) {
  const secretKey = "your_secret_key";
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decryptedUserId = decipher.update(encryptedReferralCode, "hex", "utf8");
  decryptedUserId += decipher.final("utf8");
  return decryptedUserId;
}

module.exports = { encryptReferralCode, decryptReferralCode };
