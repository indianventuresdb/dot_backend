import { Orders } from "../models/orders.js";
import fs from "fs";
import path from "path";

const getInvoiceFile = async (req, res) => {
  try {
    const { orders_Id } = req.params;

    // Retrieve the file name from the MongoDB database
    const order = await Orders.findById(orders_Id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { invoice } = order;

    // Read the file from the "invoices" directory
    const filePath = path.join(__dirname, "../invoices", invoice);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error reading file" });
      }

      // Set the appropriate headers for the file response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${invoice}`);

      // Send the file as the response
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const multi_Download_Invoice = async (req,res) => {
  res.status(200).json({message:"This api is under development."})
}

export { getInvoiceFile, multi_Download_Invoice };
