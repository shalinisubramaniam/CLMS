import { RequestHandler } from "express";
import { User } from "../models/User";
import { Enrollment } from "../models/Activities";
import { Progress } from "../models/Progress";
import { Course } from "../models/Course";

export const handleGetStudentDashboard: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;

  try {
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get enrolled courses
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    const enrolledCourses = enrollments.map(e => e.courseId);

    // Calculate progress for each course
    const courseProgress: any = {};
    for (const enrollment of enrollments) {
      const courseId = enrollment.courseId._id;
      const totalLessons = enrollment.courseId.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
      const completedLessons = await Progress.countDocuments({
        userId,
        courseId,
        completed: true
      });
      courseProgress[courseId.toString()] = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    // Get recent activity
    const recentProgress = await Progress.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate("courseId", "title");

    const recentActivity = recentProgress.map(p => ({
      text: `Completed lesson in ${(p as any).courseId?.title || 'Course'}`,
      time: new Date(p.completedAt || 0).toLocaleString(),
      icon: "CheckCircle"
    }));

    // Get recommendations based on quiz scores
    // (Simplified - in production would be more sophisticated)
    const recommendations = enrolledCourses.slice(0, 3).map((course: any) => ({
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      category: course.category
    }));

    res.json({
      totalCourses: enrolledCourses.length,
      totalPoints: user.points,
      badges: user.badges,
      learningStreak: user.streaks,
      enrolledCourses: enrolledCourses.map((c: any) => ({
        ...c.toObject(),
        progress: courseProgress[c._id.toString()]
      })),
      recentActivity,
      recommendations
    });
  } catch (err) {
    console.error("Student dashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateProgress: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  const { courseId, moduleId, lessonId } = req.body;

  try {
    // Check if progress already exists
    let progress = await Progress.findOne({ userId, courseId, moduleId, lessonId });
    
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        moduleId,
        lessonId,
        completed: true,
        completedAt: new Date()
      });
    } else if (!progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      await progress.save();
    }

    // Award points to user (10 points per lesson)
    await User.findByIdAndUpdate(userId, {
      $inc: { points: 10 },
      $set: { lastActive: new Date() }
    });

    res.json({ success: true, progress });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourseProgress: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Calculate progress
    const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
    const completedLessons = await Progress.countDocuments({
      userId,
      courseId,
      completed: true
    });
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Get completed lesson IDs
    const completedProgress = await Progress.find({
      userId,
      courseId,
      completed: true
    });
    const completedLessonIds = completedProgress.map(p => p.lessonId.toString());

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      progressPercentage,
      completedLessonIds
    });
  } catch (err) {
    console.error("Get course progress error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
