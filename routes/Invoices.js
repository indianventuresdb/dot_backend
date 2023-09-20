const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.js");
const {
  getInvoiceFile: downloadInvoice,
  multi_Download_Invoice,
  generate,
} = require("../controllers/invoices.js");

const router = express.Router();

router.get("/download_Invoice/:order_Id", downloadInvoice);
router.get("/invoice", generate);
router.get(
  "/multiple_Download_Invoices",
  isAuthenticated,
  multi_Download_Invoice
);

module.exports = router;
