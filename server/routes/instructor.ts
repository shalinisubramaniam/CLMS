import { RequestHandler } from "express";
import { Course } from "../models/Course";

export const handleAddModule: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, lessons, quiz } = req.body;
  const instructorId = (req as any).user.userId;

  try {
    const course = await Course.findOne({ _id: id, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ message: "Course not found or access denied" });
    }

    course.modules.push({ title, lessons: lessons || [], quiz: quiz || null });
    await course.save();

    res.status(200).json(course);
  } catch (err) {
    console.error("Add module error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const instructorId = (req as any).user.userId;

  try {
    const course = await Course.findOneAndDelete({ _id: id, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ message: "Course not found or access denied" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
