const crypto = require("crypto");

function generateSHA256Hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

module.exports = generateSHA256Hash;
