import { RequestHandler } from "express";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import { Progress } from "../models/Progress";
import { User } from "../models/User";

const getAverageRating = (reviews: any[] = []) => {
  if (!reviews.length) return 0;
  return Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
};

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
      modules: [],
      reviews: []
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourses: RequestHandler = async (req, res) => {
  const { search = "", category = "", price = "" } = req.query;

  try {
    const query: any = {};

    if (category) query.category = category;
    if (price) query.price = { $lte: Number(price) };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const courses = await Course.find(query).populate("instructor", "name");
    res.json(courses.map((course: any) => ({
      ...course.toObject(),
      averageRating: getAverageRating(course.reviews),
      reviewCount: course.reviews?.length || 0
    })));
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

    res.json({
      ...course.toObject(),
      averageRating: getAverageRating((course as any).reviews),
      reviewCount: (course as any).reviews?.length || 0
    });
  } catch (err) {
    console.error("Get course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCourseContent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const course = await Course.findById(id).populate("instructor", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isOwner = course.instructor && (course.instructor as any)._id.toString() === user.userId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      const enrollment = await Enrollment.findOne({ userId: user.userId, courseId: id });
      if (!enrollment) {
        return res.status(403).json({ message: "Enroll in this course to access lessons" });
      }
    }

    res.json(course);
  } catch (err) {
    console.error("Get course content error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleEnroll: RequestHandler = async (req, res) => {
  const { courseId } = req.params;
  const userId = (req as any).user.userId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const newEnrollment = await Enrollment.create({ userId, courseId, progress: 0 });
    res.status(201).json(newEnrollment);
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetEnrolledCourses: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  try {
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    res.json(enrollments.map((e: any) => e.courseId));
  } catch (err) {
    console.error("Get enrolled courses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleReviewCourse: RequestHandler = async (req, res) => {
  const userId = (req as any).user.userId;
  const { courseId, rating, reviewText } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must enroll before reviewing" });
    }

    const completedLessons = await Progress.countDocuments({ userId, courseId, completed: true });
    if (completedLessons < 1) {
      return res.status(403).json({ message: "Complete at least one lesson before reviewing" });
    }

    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = (course.reviews || []) as any[];
    const existingIndex = reviews.findIndex(review => review.userId.toString() === userId);
    const payload = {
      userId,
      studentName: user.name,
      rating: Number(rating),
      reviewText,
      date: new Date()
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = payload;
    } else {
      reviews.push(payload);
    }

    course.reviews = reviews as any;
    await course.save();

    res.json({
      message: "Review saved successfully",
      reviews: course.reviews,
      averageRating: getAverageRating(course.reviews as any)
    });
  } catch (err) {
    console.error("Review course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
