const nodemailer = require("nodemailer");

async function sendOTPByEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "GMAIL",
      auth: {
        user: process.env.USER_E_MAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_E_MAIL,
      to: email,
      subject: "Augse OTP Verification Code",
      text: `Please use this one-time password for Augse User Account Verification: ${otp}. DO NOT SHARE THIS WITH ANYONE and it is valid for 5 minutes only.`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = sendOTPByEmail;
