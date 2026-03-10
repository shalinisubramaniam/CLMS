import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB, dbCheckMiddleware } from "./db";
import { handleSignup, handleLogin } from "./routes/auth";
import { handleCreateCourse, handleGetCourses, handleGetCourseById, handleEnroll, handleGetEnrolledCourses } from "./routes/course";
import { protect, instructorOnly } from "./auth";
import { handleSeedData } from "./routes/seed";
import { handleAiChat, handleAiSummarize, handleAiQuizGen } from "./routes/ai";
import { handleSaveQuizResult, handleGetQuizResults } from "./routes/quiz";
import { handleAddModule, handleDeleteCourse } from "./routes/instructor";
import { handleGetLeaderboard } from "./routes/leaderboard";
import { handleGetCourseAnalytics } from "./routes/analytics";
import { handleGetAdminUsers, handleDeleteUser, handleDeleteCourseAdmin } from "./routes/admin";
import { handleGetRecommendations } from "./routes/recommendations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to DB
  connectDB();

  // Apply DB check for all /api routes that interact with it
  app.use("/api", dbCheckMiddleware);

  // Auth routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);

  // Course routes
  app.get("/api/courses", handleGetCourses);
  app.get("/api/courses/:id", handleGetCourseById);
  app.post("/api/courses", protect, instructorOnly, handleCreateCourse);
  app.post("/api/courses/:courseId/enroll", protect, handleEnroll);
  app.get("/api/my-courses", protect, handleGetEnrolledCourses);

  // Instructor specific routes
  app.post("/api/courses/:id/modules", protect, instructorOnly, handleAddModule);
  app.delete("/api/courses/:id", protect, instructorOnly, handleDeleteCourse);

  // AI & Analytics routes (Real handlers)
  app.post("/api/ai/chat", protect, handleAiChat);
  app.post("/api/ai/summarize", protect, handleAiSummarize);
  app.post("/api/ai/generate-quiz", protect, instructorOnly, handleAiQuizGen);
  app.get("/api/analytics/course/:id", protect, instructorOnly, handleGetCourseAnalytics);

  // Admin routes
  const adminOnly = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  };
  app.get("/api/admin/users", protect, adminOnly, handleGetAdminUsers);
  app.delete("/api/admin/users/:id", protect, adminOnly, handleDeleteUser);
  app.delete("/api/admin/courses/:id", protect, adminOnly, handleDeleteCourseAdmin);

  // Quiz routes
  app.post("/api/quiz/results", protect, handleSaveQuizResult);
  app.get("/api/quiz/results", protect, handleGetQuizResults);

  // Leaderboard route
  app.get("/api/leaderboard", protect, handleGetLeaderboard);

  // Recommendation route
  app.get("/api/recommendations", protect, handleGetRecommendations);

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
