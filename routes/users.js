import express from "express";
import { register, verify, login, loginAdmin, logout, getMyProfile, fetchUsers, deleteUser, usersNumbers } from "../controllers/user.js";
// import { isAuthenticated } from "../middlewares/auth.js";
import { isLoginData, isRegisterData } from "../validation/users_Validation.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/login_admin", loginAdmin);

router.delete("/delete/:userId", deleteUser);

router.get("/verify/:id/:key", verify);

router.get("/logout", logout);

router.get("/me", getMyProfile);

router.get("/counts", usersNumbers);

router.get("/getusers/:adminType", fetchUsers)



export default router