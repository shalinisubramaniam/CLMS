import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 }, // Duration in seconds
  notesUrl: { type: String },
  notesPdf: { type: String }
});

const QuizQuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const QuizSchema = new Schema({
  questions: [QuizQuestionSchema]
});

const ModuleSchema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
  quiz: QuizSchema
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  thumbnail: { type: String, required: true },
  modules: [ModuleSchema],
  price: { type: Number, default: 0 },
  category: { type: String, default: "Uncategorized" },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
