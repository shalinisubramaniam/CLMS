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
              {
                title: "What is React?",
                description: "Introduction to React and its core concepts",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_1.mp4",
                duration: 720,
                notesUrl: "https://example.com/lesson1.pdf"
              },
              {
                title: "JSX and Components",
                description: "Understanding JSX syntax and creating reusable components",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_2.mp4",
                duration: 840,
                notesUrl: "https://example.com/lesson2.pdf"
              },
              {
                title: "Props and State",
                description: "Managing data in React components",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_3.mp4",
                duration: 900,
                notesUrl: "https://example.com/lesson3.pdf"
              }
            ],
            quiz: { questions: [
              { question: "What is JSX?", options: ["JavaScript XML", "JavaScript Extension", "Java XML", "JSON Extension"], correctAnswer: 0 },
              { question: "What are props?", options: ["Properties passed to components", "Public properties", "Private properties", "None of the above"], correctAnswer: 0 }
            ] }
          },
          {
            title: "Module 2: Hooks & State Management",
            lessons: [
              {
                title: "useState Hook",
                description: "Managing state with the useState hook",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_4.mp4",
                duration: 780,
                notesUrl: "https://example.com/lesson4.pdf"
              },
              {
                title: "useEffect Hook",
                description: "Side effects and lifecycle with useEffect",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_5.mp4",
                duration: 850,
                notesUrl: "https://example.com/lesson5.pdf"
              },
              {
                title: "Context API",
                description: "Global state management with Context API",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_6.mp4",
                duration: 920,
                notesUrl: "https://example.com/lesson6.pdf"
              }
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
              {
                title: "Node.js Fundamentals",
                description: "Understanding Node.js runtime and event loop",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_7.mp4",
                duration: 750,
                notesUrl: "https://example.com/lesson1.pdf"
              },
              {
                title: "npm & Packages",
                description: "Managing dependencies with npm",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_8.mp4",
                duration: 680,
                notesUrl: "https://example.com/lesson2.pdf"
              },
              {
                title: "File System & Streams",
                description: "Working with files and streams in Node.js",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_9.mp4",
                duration: 810,
                notesUrl: "https://example.com/lesson3.pdf"
              }
            ],
            quiz: { questions: [
              { question: "What is the Node.js event loop?", options: ["A mechanism for handling async operations", "A loop that runs once", "A database", "A package manager"], correctAnswer: 0 }
            ] }
          },
          {
            title: "Module 2: Express & REST APIs",
            lessons: [
              {
                title: "Express Framework",
                description: "Building web servers with Express.js",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_10.mp4",
                duration: 760,
                notesUrl: "https://example.com/lesson4.pdf"
              },
              {
                title: "REST API Design",
                description: "Designing RESTful APIs with best practices",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_11.mp4",
                duration: 900,
                notesUrl: "https://example.com/lesson5.pdf"
              },
              {
                title: "Middleware & Authentication",
                description: "Using middleware and implementing authentication",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_12.mp4",
                duration: 880,
                notesUrl: "https://example.com/lesson6.pdf"
              }
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
              {
                title: "MERN Stack Overview",
                description: "Understanding the MERN stack architecture",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_13.mp4",
                duration: 700,
                notesUrl: "https://example.com/lesson1.pdf"
              },
              {
                title: "MongoDB Setup",
                description: "Installing and configuring MongoDB",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_14.mp4",
                duration: 620,
                notesUrl: "https://example.com/lesson2.pdf"
              },
              {
                title: "Project Initialization",
                description: "Setting up a MERN project from scratch",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_15.mp4",
                duration: 740,
                notesUrl: "https://example.com/lesson3.pdf"
              }
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
              {
                title: "Color Theory",
                description: "Understanding colors and their impact on design",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_16.mp4",
                duration: 680,
                notesUrl: "https://example.com/lesson1.pdf"
              },
              {
                title: "Typography Basics",
                description: "Choosing and using fonts effectively",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_17.mp4",
                duration: 650,
                notesUrl: "https://example.com/lesson2.pdf"
              },
              {
                title: "Layout & Spacing",
                description: "Creating balanced and organized layouts",
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/sample_lesson_18.mp4",
                duration: 720,
                notesUrl: "https://example.com/lesson3.pdf"
              }
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
