import { RequestHandler } from "express";
import { QuizResult } from "../models/Activities";
import { User } from "../models/User";

export const handleSaveQuizResult: RequestHandler = async (req, res) => {
  const { quizId, courseId, score } = req.body;
  const userId = (req as any).user.userId;

  try {
    const result = await QuizResult.create({
      userId,
      quizId,
      courseId,
      score,
      date: new Date()
    });

    // Reward user with points (e.g. 1 point per 10% score)
    const pointsToAdd = Math.floor(score / 10);
    await User.findByIdAndUpdate(userId, { 
      $inc: { points: pointsToAdd },
      $set: { lastActive: new Date() }
    });

    res.status(201).json({ result, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error("Save quiz result error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetQuizResults: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  try {
    const results = await QuizResult.find({ userId }).sort({ date: -1 }).populate("courseId", "title");
    res.json(results);
  } catch (err) {
    console.error("Get quiz results error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
