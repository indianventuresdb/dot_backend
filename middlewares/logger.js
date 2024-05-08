const fs = require('fs');
const path = require('path');

exports.logger = (req, res, next) => {
  const timestamp = formatDate(new Date());
  const logMessage = `${timestamp},${req.method},${decodeURI(req.url)},${res.statusCode},${res.statusMessage}\n`;

  // Writing logs to a CSV file
  const logFilePath = getLogFilePath();
  if (!fs.existsSync(logFilePath)) {
    // Write header if file doesn't exist
    const header = 'Timestamp,Method,URL,StatusCode,StatusMessage\n';
    fs.writeFileSync(logFilePath, header);
  }
  fs.appendFileSync(logFilePath, logMessage);

  // Log errors separately
  if (res.statusCode >= 400) {
    const errorLogFilePath = getErrorLogFilePath();
    if (!fs.existsSync(errorLogFilePath)) {
      // Write header if file doesn't exist
      const header = 'Timestamp,Method,URL,StatusCode,StatusMessage\n';
      fs.writeFileSync(errorLogFilePath, header);
    }
    fs.appendFileSync(errorLogFilePath, logMessage);
  }

  next();
};

function formatDate(date) {
  const pad = num => (num < 10 ? '0' : '') + num;
  const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return formattedDate;
}

// Function to get the log file path
function getLogFilePath() {
  const logsDirectory = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }
  const logFilePath = path.join(logsDirectory, 'logs.csv');
  return logFilePath;
}

// Function to get the error log file path
function getErrorLogFilePath() {
  const logsDirectory = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }
  const errorLogFilePath = path.join(logsDirectory, 'error_logs.csv');
  return errorLogFilePath;
}
