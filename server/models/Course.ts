import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 }, // Duration in seconds
  notesUrl: { type: String }
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

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  thumbnail: { type: String, required: true },
  modules: [ModuleSchema],
  reviews: [ReviewSchema],
  price: { type: Number, default: 0 },
  category: { type: String, default: "Uncategorized" }
}, { timestamps: true });

export type Review = {
  userId: Schema.Types.ObjectId;
  studentName: string;
  rating: number;
  reviewText: string;
  date: Date;
};

export { ReviewSchema };

export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
