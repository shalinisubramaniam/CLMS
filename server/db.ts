import mongoose from "mongoose";
import { RequestHandler } from "express";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clms";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    // Global setting to disable buffering to avoid long timeouts on DB failure
    mongoose.set('bufferCommands', false);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.warn("Continuing without MongoDB. Some features will not work until MONGODB_URI is configured.");
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export const dbCheckMiddleware: RequestHandler = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: "Database not connected. Please connect a MongoDB database using the MCP popover or set MONGODB_URI in settings."
    });
  }
  next();
};
