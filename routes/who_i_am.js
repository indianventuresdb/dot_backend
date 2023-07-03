import express from "express";
import { who_i_am } from "../controllers/who_i_am.js";

const router = express.Router();

router.get("/who_i_am", who_i_am);

export default router;