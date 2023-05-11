import express from "express";
import { register, login, logout, getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { setHeader } from "../middlewares/header.js";

const router = express.Router();

router.post("/register", setHeader, register);

router.post("/login", setHeader, login);

router.get("/logout", setHeader, logout);

router.get("/me", isAuthenticated, getMyProfile)

export default router