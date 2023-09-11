const validateDate = (dateString) => {
  const iso8601DateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!iso8601DateRegex.test(dateString)) {
    return false;
  }

  return true;
};

module.exports = validateDate;
