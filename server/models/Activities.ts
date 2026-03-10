import mongoose, { Schema } from "mongoose";

// Enrollment Schema
const EnrollmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  progress: { type: Number, default: 0 },
  enrolledDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

// QuizResult Schema
const QuizResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, required: true }, // Id within course modules
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const QuizResult = mongoose.model("QuizResult", QuizResultSchema);

// Achievement Schema
const AchievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  badgeName: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Achievement = mongoose.model("Achievement", AchievementSchema);
