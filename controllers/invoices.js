const { Orders } = require("../models/orders.js");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

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
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const folderName = `${year}-${month}`;
  const folderPath = path.join(__dirname, "../invoices", folderName);

  if (fs.existsSync(folderPath)) {
    const output = res.attachment(`Invoices_${folderName}.zip`);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    archive.pipe(output);
    archive.directory(folderPath, folderName);
    archive.finalize();
  } else {
    res.status(404).json({ error: "No invoices found for the current month." });
  }
};

module.exports = {
  getInvoiceFile,
  multi_Download_Invoice,
};
