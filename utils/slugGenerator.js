function generateSlug(str) {
  const lowercased = str.toLowerCase();
  const removedSpecialChars = lowercased.replace(/[^\w\s-]/g, "");
  const replacedSpaces = removedSpecialChars.replace(/\s+/g, "-");
  const urlSafeSlug = encodeURIComponent(replacedSpaces);
  return urlSafeSlug;
}

module.exports = { generateSlug };
