const { Users } = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/otpGenerator.js");
const { sendSMS } = require("../utils/smsSender.js");

const sendToken = (user, res, message, statusCode = 200, loggedBy = null) => {
  let token;
  try {
    token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
  } catch (error) {}

  if (!user.isPhoneVerified) {
    return res.status(200).json({
      status: false,
      token,
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

  res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: 120 * 60 * 1000,
      path: "/",
    })
    .json({ path });
};

// User Register Controller
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const phone_OTP = generateOTP();
  const data = {
    Text: `User Admin login OTP is ${phone_OTP} - SMSCOU`,
    Number: `${phone}`,
    SenderId: "SMSCOU",
    DRNotifyUrl: process.env.NOTIFY_HANDLER,
    DRNotifyHttpMethod: "POST",
    Tool: "API",
  };
  try {
    const user = await Users.findOne({ phone });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (hashedPassword) {
        // Sending Verification otp to the User
        const otp = await sendSMS(res, data);
        // Otp sent
        const user = await Users.create({
          name,
          email,
          phone,
          phone_OTP: phone_OTP.toString(),
          password: hashedPassword,
        });
        if (user) {
          sendToken(
            user,
            res,
            "Account Created successfully. Please check your phone and verify your account.",
            200
          );
        } else {
          return res.status(500).json({
            status: false,
            message: "Database server failed, Please try again.",
          });
        }
      }
    } else {
      return res
        .status(300)
        .json({ status: false, message: "User already registered." });
    }
  } catch (error) {
    console.log("Here is error caught: ", error);
    if (!res.headersSent) {
      return res.status(500).json({
        status: false,
        message: "Internal server error, Please try again.",
      });
    }
  }
};

// User account verify Controller
exports.verify = async (req, res) => {
  const { id, otp } = req.params;

  try {
    const user = await Users.findById(id);
    if (!user) {
      return res
        .status(300)
        .json({ status: false, message: "Account not Registered." });
    }
    if (user.isPhoneVerified) {
      return res
        .status(300)
        .json({ status: false, message: "Account already verified." });
    }
    console.log(user.phone_OTP + " " + otp);
    if (user.phone_OTP === otp) {
      await Users.findOneAndUpdate({ _id: id }, { isPhoneVerified: true });
      return res.status(200).json({
        status: true,
        message: `Congratulations ${user.name}, Your account Verified successfully.`,
      });
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
          message: "phonenumber or password incorrect.",
        });
      }
      if (!user.isEmailVerified) {
        return res.status(200).json({
          status: true,
          message:
            "Your account is not verified. Please check your email and verify your account.",
        });
      }
      sendTokenAdmin(
        user,
        res,
        user.adminType === "admin"
          ? "dashboard"
          : user.adminType === "seller"
          ? "seller"
          : user.adminType === "delivery"
          ? "delivery"
          : user.adminType === "accountant"
          ? "accountant"
          : "/",
        200
      );
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
          status: true,
          message:
            "Your account is not verified. Please check your email and verify your account.",
        });
      }
      sendTokenAdmin(
        user,
        res,
        user.adminType === "admin"
          ? "dashboard"
          : user.adminType === "seller"
          ? "seller"
          : user.adminType === "delivery"
          ? "delivery"
          : user.adminType === "accountant"
          ? "accountant"
          : "/",
        200
      );
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
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
    const { name, email, phone } = user;
    res.status(200).json({ success: true, name, email, phone });
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
