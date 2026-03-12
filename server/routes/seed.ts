import { RequestHandler } from "express";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import { Progress } from "../models/Progress";
import bcrypt from "bcryptjs";

export const handleSeedData: RequestHandler = async (req, res) => {
  try {
    // Clear existing data (preserve admin)
    await User.deleteMany({ email: { $ne: "admin@clms.com" } });
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});

    // Create Demo Instructors
    const hashedPassword = await bcrypt.hash("password123", 10);

    const instructor1 = await User.create({
      name: "Rahul Sharma",
      email: "rahul@demo.com",
      password: hashedPassword,
      role: "instructor",
      points: 0,
      badges: [],
      streaks: 0
    });

    const instructor2 = await User.create({
      name: "Priya Patel",
      email: "priya@demo.com",
      password: hashedPassword,
      role: "instructor",
      points: 0,
      badges: [],
      streaks: 0
    });

    // Create Demo Students
    const student1 = await User.create({
      name: "Arjun Nair",
      email: "arjun@demo.com",
      password: hashedPassword,
      role: "student",
      points: 0,
      badges: [],
      streaks: 0
    });

    const student2 = await User.create({
      name: "Ananya Iyer",
      email: "ananya@demo.com",
      password: hashedPassword,
      role: "student",
      points: 0,
      badges: [],
      streaks: 0
    });

    // Create Demo Courses with Modules and Lessons
    const courses = await Course.insertMany([
      {
        title: "React Development Bootcamp",
        description: "Master React.js from fundamentals to advanced patterns. Learn hooks, context API, and build production-ready applications with real-world projects.",
        instructor: instructor1._id,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        price: 4999,
        category: "Frontend",
        modules: [
          {
            title: "Module 1: React Fundamentals",
            lessons: [
              { title: "What is React?", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Introduction to React and its core concepts", notesUrl: "https://example.com/lesson1.pdf" },
              { title: "JSX and Components", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Understanding JSX syntax and creating reusable components", notesUrl: "https://example.com/lesson2.pdf" },
              { title: "Props and State", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Managing data in React components", notesUrl: "https://example.com/lesson3.pdf" }
            ],
            quiz: { questions: [
              { question: "What is JSX?", options: ["JavaScript XML", "JavaScript Extension", "Java XML", "JSON Extension"], correctAnswer: 0 },
              { question: "What are props?", options: ["Properties passed to components", "Public properties", "Private properties", "None of the above"], correctAnswer: 0 }
            ] }
          },
          {
            title: "Module 2: Hooks & State Management",
            lessons: [
              { title: "useState Hook", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Managing state with the useState hook", notesUrl: "https://example.com/lesson4.pdf" },
              { title: "useEffect Hook", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Side effects and lifecycle with useEffect", notesUrl: "https://example.com/lesson5.pdf" },
              { title: "Context API", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Global state management with Context API", notesUrl: "https://example.com/lesson6.pdf" }
            ],
            quiz: { questions: [
              { question: "What does useState return?", options: ["An array with state and setter", "A promise", "A context object", "Nothing"], correctAnswer: 0 }
            ] }
          }
        ]
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable backend systems with Node.js and Express. Learn about REST APIs, databases, authentication, and deployment strategies.",
        instructor: instructor2._id,
        thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9ed9461?q=80&w=2070&auto=format&fit=crop",
        price: 5999,
        category: "Backend",
        modules: [
          {
            title: "Module 1: Node.js Basics",
            lessons: [
              { title: "Node.js Fundamentals", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Understanding Node.js runtime and event loop", notesUrl: "https://example.com/lesson1.pdf" },
              { title: "npm & Packages", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Managing dependencies with npm", notesUrl: "https://example.com/lesson2.pdf" },
              { title: "File System & Streams", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Working with files and streams in Node.js", notesUrl: "https://example.com/lesson3.pdf" }
            ],
            quiz: { questions: [
              { question: "What is the Node.js event loop?", options: ["A mechanism for handling async operations", "A loop that runs once", "A database", "A package manager"], correctAnswer: 0 }
            ] }
          },
          {
            title: "Module 2: Express & REST APIs",
            lessons: [
              { title: "Express Framework", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Building web servers with Express.js", notesUrl: "https://example.com/lesson4.pdf" },
              { title: "REST API Design", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Designing RESTful APIs with best practices", notesUrl: "https://example.com/lesson5.pdf" },
              { title: "Middleware & Authentication", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Using middleware and implementing authentication", notesUrl: "https://example.com/lesson6.pdf" }
            ],
            quiz: { questions: [
              { question: "What is middleware in Express?", options: ["Functions that handle requests/responses", "A database", "A testing framework", "A deployment tool"], correctAnswer: 0 }
            ] }
          }
        ]
      },
      {
        title: "Full Stack MERN Masterclass",
        description: "Complete guide to building full-stack applications with MongoDB, Express, React, and Node.js. From database design to production deployment.",
        instructor: instructor1._id,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
        price: 7999,
        category: "Full Stack",
        modules: [
          {
            title: "Module 1: Project Setup & Architecture",
            lessons: [
              { title: "MERN Stack Overview", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Understanding the MERN stack architecture", notesUrl: "https://example.com/lesson1.pdf" },
              { title: "MongoDB Setup", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Installing and configuring MongoDB", notesUrl: "https://example.com/lesson2.pdf" },
              { title: "Project Initialization", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Setting up a MERN project from scratch", notesUrl: "https://example.com/lesson3.pdf" }
            ],
            quiz: { questions: [
              { question: "What does MERN stand for?", options: ["MongoDB, Express, React, Node.js", "MySQL, Express, React, Node.js", "MongoDB, Express, Ruby, Node.js", "None of the above"], correctAnswer: 0 }
            ] }
          }
        ]
      },
      {
        title: "UI/UX Design for Developers",
        description: "Learn design principles and create beautiful user interfaces. No design experience needed! Master Figma, responsive design, and modern UI trends.",
        instructor: instructor2._id,
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop",
        price: 3999,
        category: "Design",
        modules: [
          {
            title: "Module 1: Design Fundamentals",
            lessons: [
              { title: "Color Theory", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Understanding colors and their impact on design", notesUrl: "https://example.com/lesson1.pdf" },
              { title: "Typography Basics", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Choosing and using fonts effectively", notesUrl: "https://example.com/lesson2.pdf" },
              { title: "Layout & Spacing", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Creating balanced and organized layouts", notesUrl: "https://example.com/lesson3.pdf" }
            ],
            quiz: { questions: [
              { question: "What is the rule of thirds in design?", options: ["A composition guide for balanced layouts", "A color theory concept", "A typography rule", "A spacing measurement"], correctAnswer: 0 }
            ] }
          }
        ]
      }
    ]);

    // Enroll students in courses
    const enrollment1 = await Enrollment.create({
      userId: student1._id,
      courseId: courses[0]._id,
      progress: 0
    });

    const enrollment2 = await Enrollment.create({
      userId: student2._id,
      courseId: courses[1]._id,
      progress: 0
    });

    const enrollment3 = await Enrollment.create({
      userId: student1._id,
      courseId: courses[2]._id,
      progress: 0
    });

    // Clear any existing progress for these enrollments
    await Progress.deleteMany({});

    res.json({
      message: "Database seeded successfully with demo data!",
      instructors: [
        { name: instructor1.name, email: instructor1.email },
        { name: instructor2.name, email: instructor2.email }
      ],
      students: [
        { name: student1.name, email: student1.email },
        { name: student2.name, email: student2.email }
      ],
      coursesCreated: courses.length,
      enrollmentsCreated: 3,
      hint: "Login with student@demo.com or arjun@demo.com to test. Password is 'password123'"
    });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ message: "Internal server error during seeding" });
  }
};
