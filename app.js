import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users.js"
import fs from "fs"
import PDFDocument from "pdfkit";


// dot env configuration 
dotenv.config({ path: "./config.env" });

// export express 
export const app = express();

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Using Routes 
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {

    const invoice = {
        date: '2023-05-31',
        amount: '100.00',
      };

    const doc = new PDFDocument();

    // Pipe the document to a write stream (in this example, we write to a file named 'invoice.pdf')
    doc.pipe(fs.createWriteStream('invoice.pdf'));

    // Add content to the PDF document
    doc.fontSize(20).text('Invoice', { underline: true });
    doc.fontSize(12).text('Date: ' + invoice.date);
    doc.fontSize(12).text('Amount: ' + invoice.amount);

    // Finalize the PDF document
    doc.end();

    return res.status(200).json({ message: "Invoice genrated succesfully" })
})