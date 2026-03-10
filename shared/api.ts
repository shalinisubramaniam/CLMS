/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  badges: string[];
  streaks: number;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  notesUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  modules: Module[];
  price: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledDate: string;
}

export interface QuizResult {
  userId: string;
  quizId: string;
  courseId: string;
  score: number;
  date: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  rank: number;
}

export interface CourseAnalytics {
  courseId: string;
  studentEngagement: number; // percentage
  averageQuizScore: number;
  difficultTopics: string[];
  inactiveStudents: number;
}

/**
 * API Response Types
 */

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DemoResponse {
  message: string;
}
