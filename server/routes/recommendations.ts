import { RequestHandler } from "express";
import { QuizResult, Enrollment } from "../models/Activities";
import { Course } from "../models/Course";

export const handleGetRecommendations: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;

  try {
    // Find low quiz scores
    const lowScores = await QuizResult.find({ userId, score: { $lt: 70 } });
    const enrolledCourses = await Enrollment.find({ userId }).select("courseId");
    const enrolledIds = enrolledCourses.map(e => e.courseId.toString());

    if (lowScores.length > 0) {
      // Recommend courses in the same category as the one with low score
      const courseWithLowScore = await Course.findById(lowScores[0].courseId);
      const recommendations = await Course.find({ 
        category: courseWithLowScore?.category,
        _id: { $nin: enrolledIds }
      }).limit(3);
      
      return res.json({ 
        type: "improvement",
        reason: `Based on your score in ${courseWithLowScore?.title}`,
        courses: recommendations 
      });
    }

    // Default: Recommend popular or new courses not yet enrolled
    const recommendations = await Course.find({ 
      _id: { $nin: enrolledIds } 
    }).limit(3);

    res.json({ 
      type: "trending",
      reason: "Trending courses you might like",
      courses: recommendations 
    });
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
