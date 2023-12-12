const { Users } = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/otpGenerator.js");
const sendOTPByEmail = require("../utils/sendOTPByEmail.js");

const sendToken = (user, res, message, statusCode = 200, loggedBy = null) => {
  let token;
  try {
    token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set the JWT token as a cookie
    res.cookie("token", btoa(token), {
      httpOnly: true, // Cookie can only be accessed by the server, not JavaScript in the browser
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "none", // Restrict cookie to same-site requests
    });
  } catch (error) {
    // Handle error here
  }

  if (!user.isPhoneVerified) {
    return res.status(200).json({
      status: false,
      id: user._id,
      message:
        "Your account is not verified. Please check your phone and verify your account.",
    });
  }

  res
    .status(statusCode)
    .json({ status: true, message, token: btoa(token), id: user._id });
};

const sendTokenAdmin = (user, res, path, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res.set({
    "Content-Type": "application/json",
    "set-cookie": `auth=${btoa(token)}`,
  });

  res
    .cookie("token", token, {
      maxAge: 720 * 60 * 1000,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .status(statusCode)
    .json({
      status: true,
      userType: path,
      userId: user._id,
      token: btoa(token),
    });
};

// User Register Controller
exports.register = async (req, res) => {
  const { name, email, phone, password, referral } = req.body;
  const email_OTP = generateOTP();

  try {
    const user = await Users.findOne({ phone });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (hashedPassword) {
        const otpEmailResult = await sendOTPByEmail(email, email_OTP);
        if (otpEmailResult.success) {
          let couponCodeArr = [];
          if (referral) {
            couponCodeArr = ["WelcomeToAugse5"];
          }
          const user = await Users.create({
            name,
            email,
            phone,
            phone_OTP: email_OTP.toString(),
            password: hashedPassword,
            referredBy: referral,
            activeCouponCode: couponCodeArr,
          });
          if (user) {
            res.status(200).json({
              status: false,
              id: user._id,
              message:
                "Your account is not verified. Please check your phone and verify your account.",
            });
          } else {
            return res.status(500).json({
              status: false,
              message: "Database server failed, Please try again.",
            });
          }
        } else {
          return res.status(500).json({
            status: false,
            message: "Failed to send OTP via email.",
          });
        }
      }
    } else {
      return res
        .status(300)
        .json({ status: false, message: "User already registered." });
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({
        status: false,
        message: "Internal server error, Please try again.",
      });
    }
  }
};

exports.customerLogin = async (req, res) => {
  const { email } = req.body;
  try {
    const email_OTP = generateOTP();
    let user = await Users.findOne({ email });
    if (!user) {
      user = await Users.create({
        email,
        phone_OTP: email_OTP.toString(),
        isPhoneVerified: true,
      });
    } else {
      user.phone_OTP = email_OTP.toString();
      await user.save();
    }
    if (!user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const otpEmailResult = await sendOTPByEmail(email, email_OTP);
    if (otpEmailResult.success) {
      res.status(200).json({
        status: false,
        id: user._id,
        message:
          "Your account is not verified. Please check your email and verify your account.",
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Failed to send OTP via email.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User account verify Controller
exports.verify = async (req, res) => {
  const { id, otp } = req.params;

  try {
    let user = await Users.findById(id);
    if (!user) {
      return res
        .status(300)
        .json({ status: false, message: "Account not Registered." });
    }
    // if (user.isPhoneVerified) {
    //   return res
    //     .status(300)
    //     .json({ status: false, message: "Account already verified." });
    // }
    if (user.phone_OTP === otp) {
      await Users.findOneAndUpdate({ _id: id }, { isPhoneVerified: true });
      user = await Users.findById(id);
      sendToken(
        user,
        res,
        `Congratulations ${user.name}, Your account Verified successfully.`,
        200
      );
    } else {
      return res.status(200).json({
        status: false,
        message: `Sorry ${user.name}, You have entered wrong otp`,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server ERROR" });
  }
};

exports.createEmployeeAccount = async (req, res) => {
  try {
    const { name, email, phone, password, adminType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const employee = await Users.create({
      name,
      email,
      phone,
      phone_OTP: otp.toString(),
      password: hashedPassword,
      adminType,
    });

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
      subject: "Welcome to Our Company",
      text: `Dear ${name},\n\nWelcome to our company! Your account has been successfully created. Your password is as: ${password}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Account created", user: employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server ERROR" });
  }
};

// User Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await Users.findOne({ email }).select("+password");
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
  if (!user) {
    return res.status(300).json({ status: false, message: "No user found" });
  }

  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    return res
      .status(300)
      .json({ status: false, message: "Email or password incorrect." });
  }

  sendToken(user, res, "Login successful", 200, "loggedBy: Email");
};

// User Login Controller
exports.loginAdmin = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    if (!email) {
      const user = await Users.findOne({ phone });
      if (!user) {
        return res.status(500).json({
          status: false,
          message: "phone number or password incorrect.",
        });
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        return res.status(500).json({
          status: false,
          message: "Phonenumber or Password Incorrect.",
        });
      }
      if (!user.isEmailVerified) {
        return res.status(200).json({
          status: true,
          message:
            "Your account is not verified. Please check your email and verify your account.",
        });
      }
      sendTokenAdmin(user, res, user.adminType, 200);
    } else {
      const user = await Users.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(500)
          .json({ status: false, message: "Email or password incorrect." });
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        return res
          .status(500)
          .json({ status: false, message: "Email or password incorrect." });
      }
      if (!user.isPhoneVerified) {
        return res.status(200).json({
          status: false,
          message:
            "Your account is not verified. Please check your email and verify your account.",
        });
      }
      sendTokenAdmin(user, res, user.adminType, 200);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.verifyAndLogin = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isPhoneVerified) {
      if (user.otp === otp) {
        user.isPhoneVerified = true;
        await user.save();
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect OTP" });
      }
    }

    sendTokenAdmin(user, res, user.adminType, 200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// user Logout
exports.logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "Logout successfully......." });
};

// get profile data
exports.getMyProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    const { name, email, phone, adminType } = user;
    res
      .status(200)
      .json({ success: true, name, email, phone, employeeType: adminType });
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, message: "Please login and try again" });
  }
};

exports.userProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id)
      .populate("address")
      .populate("orders");
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, message: "Failed to fetch data" });
  }
};

// Users fetching for admin
exports.fetchUsers = async (req, res) => {
  const { adminType } = req.params;
  try {
    if (adminType === "all" || adminType === "All") {
      const users = await Users.find();
      if (!users) {
        return res.status(200).json({ message: "Users not found" });
      }
      return res.status(200).json(users);
    }
    const users = await Users.find({ adminType });
    if (!users) {
      return res.status(200).json({ message: "Users not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(200).json({ message: "Failed to fetch users." });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      return res.status(300).json({ message: "user deletion failed." });
    }
    return res.status(200).json({ message: "user deleted successfully." });
  } catch (error) {
    return res.status(300).json({ message: "user deletion failed." });
  }
};

// Users counter
exports.usersNumbers = async (req, res) => {
  try {
    const documentCount = await Users.count({});
    if (!documentCount) {
      return res.status(300).json({ message: "fail to count" });
    }
    return res.status(200).json({ numbers: documentCount });
  } catch (error) {
    return res.status(300).json({ message: "fail to count" });
  }
};

// Check user
exports.verifyUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(402)
      .json({ success: false, message: "You are not logged in" });
  }

  try {
    const decoded = jwt.verify(atob(token), process.env.JWT_SECRET);
    // If decoding is successful, respond with the decoded token.
    const user = await Users.findById(decoded._id);
    !user
      ? res.status(404).json({ success: false })
      : res.status(200).json({ success: true, userType: user.adminType });
  } catch (error) {
    // If there's an error (e.g., token is invalid or expired), handle it gracefully.
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user;
  const { name, email, phone, oldpwd, password } = req.body;

  try {
    const user = await Users.findById(userId).select("+password");
    const isPasswordValid = await bcrypt.compare(oldpwd, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(201).json({ message: "User information updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user;
  const { oldPassword, password } = req.body;

  try {
    const user = await Users.findById(userId).select("+password");
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(201).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const phone_OTP = generateOTP();
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = await sendOTPByEmail(email, phone_OTP);
    if (!response.success) console.error("Failed to send OTP:", response.error);
    user.phone_OTP = phone_OTP;
    await user.save();
    res.status(200).json({ message: "Otp Sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phone_OTP !== otp) {
      return res.status(404).json({ message: "Incorrect Otp" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};
