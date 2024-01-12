const getClientIpAddress = (req) => {
  return req.ip;
};

const getClientUserAgent = (req) => {
  return req.get("User-agent");
};

module.exports = { getClientIpAddress, getClientUserAgent };
