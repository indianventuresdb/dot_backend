import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";
import productsRouter from "./routes/products.js";
import invoice from "./routes/Invoices.js";

// dot env configuration
dotenv.config({ path: "./config.env" });

// export express
export const app = express();
app.use(cors());
// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Use the user router
app.use("/api/v1/user", userRouter);

// Use the orders router
app.use("/api/v1/orders", ordersRouter);


// Use the products router
app.use("/api/v1/products", productsRouter);


// Use the products router
app.use("/api/v1/invoice", invoice);
