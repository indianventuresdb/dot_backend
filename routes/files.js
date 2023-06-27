import express from "express";
import { downloadImageController } from "../controllers/files.js";

const router = express.Router();

router.get("/uploads/:fileName", downloadImageController);

export default router;