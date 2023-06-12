import express from "express";
import { register, verify, login, logout, getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isLoginData, isRegisterData } from "../validation/users_Validation.js";

const router = express.Router(); 

router.post("/register", isRegisterData, register);

router.get("/verify/:id/:key", verify);

router.post("/login", isLoginData, login,);

router.get("/logout", logout);

router.post("/newuser");

router.get("/me", isAuthenticated, getMyProfile)

router.get("/users/:id");
export default router