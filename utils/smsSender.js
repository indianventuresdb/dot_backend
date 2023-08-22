async function sendSMS(data) {
  try {
    const url = `https://restapi.smscountry.com/v0.1/Accounts/${process.env.SMS_AUTH_KEY}/SMSes/`;

    const options = {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.SMS_AUTH_HEADER}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      res.status(300).json({ success: false });
      return { success: false };
    }

    const responseData = await response.json();

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false };
  }
}

module.exports = {
  sendSMS,
};
