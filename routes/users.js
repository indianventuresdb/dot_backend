import express from "express";
import { register, verify, login, logout, getMyProfile, fetchUsers, deleteUser } from "../controllers/user.js";
// import { isAuthenticated } from "../middlewares/auth.js";
import { isLoginData, isRegisterData } from "../validation/users_Validation.js";

const router = express.Router();

router.post("/register", isRegisterData, register);

router.post("/login", isLoginData, login);

router.delete("/delete/:userId", deleteUser);

router.get("/verify/:id/:key", verify);

router.get("/logout", logout);

router.get("/me", getMyProfile)

router.get("/getusers/:adminType", fetchUsers)



export default router