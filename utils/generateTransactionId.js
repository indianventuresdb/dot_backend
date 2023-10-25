function generateUniqueString() {
  const prefix = "AUGSE";
  const randomString = Math.random().toString(36).substring(2, 12);
  return prefix + "-" + randomString;
}

module.exports = { generateUniqueString };
