import mongoose, { Schema } from "mongoose";

const ProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  moduleId: { type: Schema.Types.ObjectId, required: true },
  lessonId: { type: Schema.Types.ObjectId, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

export const Progress = mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
