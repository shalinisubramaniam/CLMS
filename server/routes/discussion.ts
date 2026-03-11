import { RequestHandler } from "express";
import { Discussion } from "../models/Discussion";
import { User } from "../models/User";

export const handleCreateDiscussion: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  const { courseId, title, content } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const discussion = await Discussion.create({
      courseId,
      userId,
      userName: user.name,
      title,
      content
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error("Create discussion error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourseDiscussions: RequestHandler = async (req, res) => {
  const { courseId } = req.params;

  try {
    const discussions = await Discussion.find({ courseId })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    res.json(discussions);
  } catch (err) {
    console.error("Get discussions error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleAddReply: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  const { discussionId, content } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      {
        $push: {
          replies: {
            userId,
            userName: user.name,
            content,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json(discussion);
  } catch (err) {
    console.error("Add reply error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourseNotes: RequestHandler = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Return a placeholder notes URL
    // In production, you'd fetch from S3 or a file server
    const notesUrl = `https://example.com/courses/${courseId}/notes.pdf`;
    
    res.json({
      courseId,
      notesUrl,
      fileName: "course-notes.pdf"
    });
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
