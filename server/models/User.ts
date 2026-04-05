import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  streaks: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
