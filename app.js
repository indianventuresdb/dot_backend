const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.js");
const paymentRouter = require("./routes/payment.js");
const ordersRouter = require("./routes/orders.js");
const shipOrdersRouter = require("./routes/shipping.js");
const productsRouter = require("./routes/products.js");
const rewardsRouter = require("./routes/rewards.js");
const addressRouter = require("./routes/address.js");
const sliderRouter = require("./routes/slider.js");
const salesRouter = require("./routes/sales.js");
const categoryRouter = require("./routes/category.js");
const testRouter = require("./routes/testing.js");
const invoice = require("./routes/Invoices.js");
const { logger } = require("./middlewares/logger.js");
const { pathToUrl } = require("./utils/pathToUrl.js");
const fileSender = require("./routes/files.js");
const who_i_am = require("./routes/who_i_am.js");
const { Slides } = require("./models/slider.js");
const multer = require("multer");
const tagsRouter = require("./routes/tags.js");

// dot env configuration
dotenv.config();
dotenv.config({ path: "./config.env" });

// Create an express instance
const app = express();

// Using Middlewares
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// disk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// Use the user router
app.use("/api/v1/indentifier", who_i_am);

// Use the user router
app.use("/api/v1/user", userRouter);

// Use the Address router
app.use("/api/v1/address", addressRouter);

// Use the Shiproket router
app.use("/api/v1/shiprocket", addressRouter);

app.use("/api/v1/test", testRouter);

app.use("/api/v1/shipping", shipOrdersRouter);

// Use the tags router
app.use("/api/v1/tags", tagsRouter);

// Use the category router
app.use("/api/v1/category", categoryRouter);

// Use the sales router
app.use("/api/v1/sales", salesRouter);

// Use the orders router
app.use("/api/v1/orders", ordersRouter);

app.use("/api/v1/rewards", rewardsRouter);

// Use the products router
app.use("/api/v1/products", upload.single("image"), productsRouter);

// Use the products router
app.use("/api/v1/payment", paymentRouter);

// Use the Invoice router
app.use("/api/v1/invoice", invoice);

// Use the fileSender router
app.use("/files", fileSender);

// Use the fileSender router
app.use("/slider", sliderRouter);

// file Uploader
app.post("/upload/:type", upload.single("file"), async function (req, res) {
  const { type } = req.params;
  if (type === "product") {
    return res.status(200).json({ fileName: pathToUrl(req.file.path) });
  } else if (type === "slide") {
    try {
      const filePath = pathToUrl(req.file.path);
      const file = await Slides.findOne({ slidePath: filePath });
      if (file) {
        return res.status(300).json({ message: "File already uploaded." });
      } else {
        const file = await Slides.create({ slidePath: filePath });
        if (file) {
          return res.status(200).json({ filePath });
        } else {
          return res.status(301).json({ message: "File not uploaded" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(302).json({ message: "File not uploaded" });
    }
  } else {
    return res.status(404).json({ message: "not found" });
  }
});

// Delete file from the upload directory
app.delete("/files/delete/:filename", (req, res) => {
  const fileName = req.params.filename;
  console.log(fileName);
  const filePath = path.join(__dirname, "uploads", fileName);
  console.log(filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to delete the file.");
    } else {
      res.status(200).json({ message: "File deleted successfully." });
    }
  });
});

// Export the app
module.exports = { app };
