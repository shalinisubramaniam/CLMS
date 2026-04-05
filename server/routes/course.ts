import { RequestHandler } from "express";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import { User } from "../models/User";

export const handleCreateCourse: RequestHandler = async (req, res) => {
  const { title, description, thumbnail, price, category } = req.body;
  const instructorId = (req as any).user.userId;

  try {
    const course = await Course.create({
      title,
      description,
      instructor: instructorId,
      thumbnail,
      price,
      category,
      modules: []
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.json(courses);
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourseById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate("instructor", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error("Get course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleEnrollCourse: RequestHandler = async (req, res) => {
  const courseId = req.params.courseId;
  const userId = (req as any).user.userId;

  try {
    const [user, course, existingEnrollment] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
      Enrollment.findOne({ userId, courseId })
    ]);

    if (!user || !course) {
      return res.status(404).json({ message: "Course or user not found" });
    }

    const alreadyEnrolled =
      existingEnrollment ||
      user.enrolledCourses?.some((id: any) => id.toString() === courseId) ||
      course.students?.some((id: any) => id.toString() === userId);

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } }),
      Course.findByIdAndUpdate(courseId, { $addToSet: { students: userId } }),
      Enrollment.create({ userId, courseId })
    ]);

    res.status(201).json({
      message: "Enrollment successful",
      courseId,
      userId
    });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleEnroll = handleEnrollCourse;

export const handleGetEnrolledCourses: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  try {
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    res.json(enrollments.map(e => e.courseId));
  } catch (err) {
    console.error("Get enrolled courses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
