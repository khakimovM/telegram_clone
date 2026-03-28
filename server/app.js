import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import "dotenv/config";
import rootRouter from "./routers/routes.js";
import mongoose from "mongoose";
import errorHandler from "./utils/error.handler.js";
import connectDB from "./config/database.js";

const app = express();

// const server = http.createServer(app);
app.use(express.json());
app.use("/api", rootRouter);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is runnning on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
