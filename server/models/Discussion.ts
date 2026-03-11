import mongoose, { Schema } from "mongoose";

const ReplySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DiscussionSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Discussion = mongoose.models.Discussion || mongoose.model("Discussion", DiscussionSchema);
