import { RequestHandler } from "express";
import { User } from "../models/User";
import { Course } from "../models/Course";

export const adminOnlyMiddleware: RequestHandler = (req, res, next) => {
  if ((req as any).user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

export const handleGetAdminUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteCourseAdmin: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    res.json({ message: "Course removed successfully" });
  } catch (err) {
    console.error("Admin delete course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleApproveCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.status = "approved";
    await course.save();

    res.json({ message: "Course approved successfully", course });
  } catch (err) {
    console.error("Admin approve course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
