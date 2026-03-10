import { RequestHandler } from "express";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import bcrypt from "bcryptjs";

export const handleSeedData: RequestHandler = async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({ email: { $ne: "admin@clms.com" } });
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    // Create Demo Instructor
    const hashedInstructorPassword = await bcrypt.hash("password123", 10);
    const instructor = await User.create({
      name: "Dr. Sarah Johnson",
      email: "instructor@demo.com",
      password: hashedInstructorPassword,
      role: "instructor"
    });

    // Create Demo Student
    const hashedStudentPassword = await bcrypt.hash("password123", 10);
    const student = await User.create({
      name: "Alex Rivers",
      email: "student@demo.com",
      password: hashedStudentPassword,
      role: "student",
      points: 120,
      badges: ["Fast Learner", "Quiz Master"],
      streaks: 7
    });

    // Create Demo Courses
    const courses = await Course.insertMany([
      {
        title: "Intro to Modern React Development",
        description: "Learn React from scratch with hooks, context API, and real-world projects.",
        instructor: instructor._id,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        price: 49,
        category: "Frontend"
      },
      {
        title: "Advanced Node.js & Microservices",
        description: "Scale your applications with microservices, Kafka, and advanced Node.js patterns.",
        instructor: instructor._id,
        thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9ed9461?q=80&w=2070&auto=format&fit=crop",
        price: 79,
        category: "Backend"
      },
      {
        title: "UI Design for Developers",
        description: "Learn how to build beautiful interfaces even if you are not a designer.",
        instructor: instructor._id,
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop",
        price: 29,
        category: "Design"
      }
    ]);

    // Enroll student in one course
    await Enrollment.create({
      userId: student._id,
      courseId: courses[0]._id,
      progress: 65
    });

    res.json({ message: "Database seeded successfully with demo data!" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ message: "Internal server error during seeding" });
  }
};
