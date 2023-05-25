import express from "express";
import { register, verify, login, logout, getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { setHeader } from "../middlewares/header.js";
import { isLoginData, isRegisterData } from "../validation/users_Validation.js";

const router = express.Router();

router.post("/register", isRegisterData, register);

router.get("/verify/:id/:key", setHeader, verify);

router.post("/login", setHeader, isLoginData, login,);

router.get("/logout", setHeader, logout);

router.get("/me", isAuthenticated, getMyProfile)

export default router