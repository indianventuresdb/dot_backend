

import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getInvoiceFile as downloadInvoice, multi_Download_Invoice } from "../controllers/invoices.js";

const router = express.Router();

router.get("/download_Invoice/:order_Id", downloadInvoice);
router.get("/multiple_Download_Invoices", isAuthenticated, multi_Download_Invoice);

export default router 