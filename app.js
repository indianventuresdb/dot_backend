import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// dot env configuration 
dotenv.config({ path: "./config.env" });

// export express 
export const app = express();

// Using Middlewares
app.use(express.json());
app.use(cookieParser())

