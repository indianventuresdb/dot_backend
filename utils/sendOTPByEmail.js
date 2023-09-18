const nodemailer = require("nodemailer");

async function sendOTPByEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "GMAIL",
      auth: {
        user: "garudasofttech0@gmail.com",
        pass: "nnkknkyznyyadocf",
      },
    });

    const mailOptions = {
      from: "garudasofttech0@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = sendOTPByEmail;
