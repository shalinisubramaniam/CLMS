import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import { QuizResult } from "../models/Activities";

const uploadDir = path.join(process.cwd(), "uploads", "lessons");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    cb(null, safeName);
  }
});

export const lessonUpload = multer({ storage });

export const handleGetInstructorDashboard: RequestHandler = async (req, res) => {
  const instructorId = (req as any).user.userId;

  try {
    // Get all courses created by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const totalCourses = courses.length;

    // Get total students enrolled across all courses
    let totalStudents = 0;
    let totalRevenue = 0;
    let totalEnrollments = 0;

    for (const course of courses) {
      const enrollments = await Enrollment.countDocuments({ courseId: course._id });
      totalStudents += enrollments;
      totalEnrollments += enrollments;
      totalRevenue += enrollments * (course.price || 0);
    }

    // Calculate engagement rate (based on quiz submissions)
    let totalQuizzes = 0;
    for (const course of courses) {
      const quizzes = await QuizResult.countDocuments({ courseId: course._id });
      totalQuizzes += quizzes;
    }
    const engagementRate = totalEnrollments > 0 ? Math.round((totalQuizzes / totalEnrollments) * 100) : 0;

    res.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      engagementRate,
      instructorCourses: courses.map(c => ({
        _id: c._id,
        title: c.title,
        description: c.description,
        thumbnail: c.thumbnail,
        price: c.price,
        category: c.category,
        createdAt: c.createdAt
      }))
    });
  } catch (err) {
    console.error("Instructor dashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetInstructorCourseStudents: RequestHandler = async (req, res) => {
  const instructorId = (req as any).user.userId;
  const { courseId } = req.params;

  try {
    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get enrollments
    const enrollments = await Enrollment.find({ courseId }).populate("userId", "name email");

    const students = enrollments.map(e => ({
      id: (e.userId as any)._id,
      name: (e.userId as any).name,
      email: (e.userId as any).email,
      enrolledDate: e.enrolledDate,
      progress: e.progress
    }));

    res.json(students);
  } catch (err) {
    console.error("Get course students error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCreateInstructorCourse: RequestHandler = async (req, res) => {
  const instructorId = (req as any).user.userId;
  const { title, description, thumbnail, price, category } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      instructor: instructorId,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
      price,
      category,
      status: "pending",
      modules: []
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleAddLesson: RequestHandler = async (req, res) => {
  const instructorId = (req as any).user.userId;
  const { courseId, moduleId, title, description, duration, videoUrl, notesPdf, notesUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (course.status !== "approved") {
      return res.status(400).json({ message: "Course must be approved before adding lessons" });
    }

    const module = course.modules.find(m => m._id.toString() === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const uploadedVideoUrl = req.file ? `/uploads/lessons/${req.file.filename}` : videoUrl;

    if (!uploadedVideoUrl) {
      return res.status(400).json({ message: "Video URL or file upload is required" });
    }

    module.lessons.push({
      title,
      description: description || "",
      videoUrl: uploadedVideoUrl,
      duration: Number(duration) || 0,
      notesUrl: notesUrl || notesPdf || "",
      notesPdf: notesPdf || notesUrl || ""
    } as any);

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Add lesson error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
