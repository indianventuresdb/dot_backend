exports.logger = (req, res, next) => {
  const timestamp = formatDate(new Date());
  res.on("finish", function() {
    console.log(`${timestamp} || ${req.method} ${decodeURI(req.url)} ${res.statusCode} ${res.statusMessage}`);
  });
  next();
};

function formatDate(date) {
  const pad = num => (num < 10 ? '0' : '') + num;
  const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${pad(date.getMilliseconds())}`;
  return formattedDate;
}
