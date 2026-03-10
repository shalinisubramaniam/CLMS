import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./db";
import { handleSignup, handleLogin } from "./routes/auth";
import { handleCreateCourse, handleGetCourses, handleGetCourseById, handleEnroll, handleGetEnrolledCourses } from "./routes/course";
import { protect, instructorOnly } from "./auth";
import { handleSeedData } from "./routes/seed";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to DB
  connectDB();

  // Auth routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);

  // Course routes
  app.get("/api/courses", handleGetCourses);
  app.get("/api/courses/:id", handleGetCourseById);
  app.post("/api/courses", protect, instructorOnly, handleCreateCourse);
  app.post("/api/courses/:courseId/enroll", protect, handleEnroll);
  app.get("/api/my-courses", protect, handleGetEnrolledCourses);

  // AI & Analytics routes (Placeholders)
  app.post("/api/ai/chat", protect, (req, res) => res.json({ message: "AI response placeholder" }));
  app.post("/api/ai/summarize", protect, (req, res) => res.json({ message: "AI summary placeholder" }));

  // Seed route (for testing purposes)
  app.get("/api/seed", handleSeedData);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
