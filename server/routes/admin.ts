import { RequestHandler } from "express";
import { User } from "../models/User";
import { Course } from "../models/Course";

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
