const { Users } = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/otpGenerator.js");
const { sendSMS } = require("../utils/smsSender.js");

const sendToken = (
  user,
  res,
  message,
  otp,
  statusCode = 200,
  loggedBy = null
) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: 120 * 60 * 1000,
      path: "/",
    })
    .json({ status: true, message, otp });
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
            "Account Created successfully. Please check your email and verify your account.",
            otp,
            200
          );
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
  const { id, key } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res
        .status(300)
        .json({ status: false, message: "Account not Registered." });
    }
    if (user.isEmailVerified) {
      return res
        .status(300)
        .json({ status: false, message: "Account already verified." });
    }
    if (user.emailVerifyKey === key) {
      await Users.findOneAndUpdate({ _id: id }, { isEmailVerified: true });
      return res.status(200).json({
        status: true,
        message: `Congratulations ${user.name}, Your account Verified successfully.`,
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
  console.log(email + " " + password);

  let user;
  try {
    user = await Users.findOne({ email }).select("+password");
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
  if (!user) {
    return res
      .status(300)
      .json({ status: false, message: "Email or password incorrect." });
  }

  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    return res
      .status(300)
      .json({ status: false, message: "Email or password incorrect." });
  }
  // if (!user.isEmailVerified) {
  //   return res.status(200).json({
  //     status: true,
  //     message:
  //       "Your account is not verified. Please check your email and verify your account.",
  //   });
  // }

  //Temoprary OTP added
  sendToken(user, res, "Login successful", 123456, 200, "loggedBy: Email");
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
exports.getMyProfile = (req, res) => {
  res.status(200).json({ success: false, user: req.user });
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
