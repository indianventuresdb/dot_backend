function generateSlug(str, existingSlugs) {
  const lowercased = str.toLowerCase();
  const removedSpecialChars = lowercased.replace(/[^\w\s-]/g, "");
  const replacedSpaces = removedSpecialChars.replace(/\s+/g, "-");
  const urlSafeSlug = encodeURIComponent(replacedSpaces);

  let finalSlug = urlSafeSlug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${urlSafeSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

module.exports = { generateSlug };
