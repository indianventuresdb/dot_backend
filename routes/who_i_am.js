import express from "express";
import { who_i_am } from "../middlewares/who_i_am.js";
import { user_identifier } from "../controllers/who_i_am.js";

const router = express.Router();

router.get("/who_i_am", who_i_am, user_identifier);

export default router;