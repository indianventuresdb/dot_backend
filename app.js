import express from "express";
import cors from "cors";
import connectToMongo from "./database/connectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import fs from "fs";
import ordersRouter from "./routes/orders.js";
import axios from "axios";

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

// const PORT = 5000;

// app.listen(PORT, () => {
//   try {
//     connectToMongo();
//     console.log(`Backend Listening on Port: ${PORT}`);
//     console.log("hii");
//   } catch (e) {
//     console.log(e);
//   }
// });

// // Example of using Axios to make a GET request
// axios.post("http://localhost:5000/api/v1/user")
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });
