import { RequestHandler } from "express";
import { User } from "../models/User";

export const handleGetLeaderboard: RequestHandler = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "student" })
      .sort({ points: -1 })
      .limit(10)
      .select("name points badges streaks");
    
    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
