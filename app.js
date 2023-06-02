
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users.js";
import fs from "fs";
import ordersRouter from "./routes/orders.js";

// dot env configuration
dotenv.config({ path: "./config.env" });

// export express
export const app = express();

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Use the user router
app.use("/api/v1/user", userRouter);

// Use the orders router
app.use("/api/v1/orders", ordersRouter);


