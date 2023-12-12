const express = require("express");
const {
  register,
  verify,
  login,
  loginAdmin,
  logout,
  getMyProfile,
  fetchUsers,
  deleteUser,
  usersNumbers,
  userProfile,
  customerLogin,
  verifyUser,
  resetPasswordOtp,
  resetPassword,
  createEmployeeAccount,
  updateProfile,
  updatePassword,
  verifyAndLogin,
} = require("../controllers/user.js");
const { isAuthenticated } = require("../middlewares/auth.js");
const {
  isLoginData,
  isRegisterData,
} = require("../validation/users_Validation.js");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/customer/login", customerLogin);

router.post("/login_admin", loginAdmin);

router.post("/verifyUserType", verifyUser);

router.delete("/delete/:userId", deleteUser);

router.get("/verify/:id/:otp", verify);

router.get("/logout", logout);

router.get("/me/:id", getMyProfile);

router.get("/counts", usersNumbers);

router.get("/getusers/:adminType", fetchUsers);

router.get("/detail/:id", userProfile);

router.post("/update", isAuthenticated, updateProfile);

router.post("/update/pwd", isAuthenticated, updatePassword);

router.post("/resetPasswordOtp", resetPasswordOtp);

router.post("/resetPassword", resetPassword);

router.post("/employee/register", createEmployeeAccount);

router.post("/verify_login", verifyAndLogin);

module.exports = router;
