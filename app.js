import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";
import productsRouter from "./routes/products.js";
import invoice from "./routes/Invoices.js";
import { logger } from "./middlewares/logger.js";
import multer from "multer"
import { pathToUrl } from "./utils/pathToUrl.js";
import fileSender from "./routes/files.js";
import who_i_am from "./routes/who_i_am.js"

// dot env configuration
dotenv.config({ path: "./config.env" });

// export express
export const app = express();
// Using Middlewares
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //  Files parser
app.use(cookieParser());
app.use(express.static("public"));

// disk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// Use the user router
app.use("/api/v1/indentifier", who_i_am);

// Use the user router
app.use("/api/v1/user", userRouter);

// Use the orders router
app.use("/api/v1/orders", ordersRouter);

// Use the products router
app.use("/api/v1/products", productsRouter);

// Use the Invoice router
app.use("/api/v1/invoice", invoice);

// Use the fileSender router
app.use("/files", fileSender);


// file Uploader
app.post("/upload", upload.single("file"), (req, res) => {
  return res.status(200).json({ fileName: pathToUrl(req.file.path) })
})