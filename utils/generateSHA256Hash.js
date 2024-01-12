const crypto = require("crypto");

function generateSHA256Hash(data) {
  if (!data) return null;
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

module.exports = generateSHA256Hash;
