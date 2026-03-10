import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clms";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // In dev environment, we don't want to crash the whole vite process
    // especially if the user hasn't set up the connection yet.
    console.warn("Continuing without MongoDB. Some features will not work until MONGODB_URI is configured.");
  }
}
