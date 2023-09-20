const { Orders } = require("../models/orders.js");
const fs = require("fs");
const path = require("path");
const generateInvoice = require("../utils/generateInvoice.js");

const getInvoiceFile = async (req, res) => {
  try {
    const { order_Id } = req.params;
    const order = await Orders.findOne({ _id: order_Id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const { invoiceFileName } = order;
    const filePath = path.join(__dirname, "../", invoiceFileName);
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error reading file" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoiceFileName}`
      );

      res.send(data);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const multi_Download_Invoice = async (req, res) => {
  res.status(200).json({ message: "This api is under development." });
};

const generate = async (req, res) => {
  const outputPath = `invoices/invoice_0.4885354587472781.pdf`;

  generateInvoice("retgdfyjhuki", outputPath)
    .then(() => {
      res.status(200).json({ message: "Invoice generated successfully" });
    })
    .catch((error) => {
      res.status(200).json({ message: error });
    });
};

module.exports = {
  getInvoiceFile,
  multi_Download_Invoice,
  generate,
};
