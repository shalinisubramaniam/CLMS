import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboardNew";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import PaymentPage from "./pages/PaymentPage";
import AiAssistant from "./pages/AiAssistant";
import CoursePlayer from "./pages/CoursePlayerNew";
import QuizPage from "./pages/QuizPage";
import CreateCourse from "./pages/CreateCourse";
import Leaderboard from "./pages/Leaderboard";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute roles={["student", "admin"]}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-detail/:id" element={<CourseDetail />} />
            <Route path="/payment/:courseId" element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/course/:id" element={
              <ProtectedRoute roles={["student", "instructor", "admin"]}>
                <CoursePlayer />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:id" element={
              <ProtectedRoute roles={["student", "instructor", "admin"]}>
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/create-course" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/analytics/:id" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <InstructorAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/instructor/analytics" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <PlaceholderPage title="Course Analytics" description="Detailed insights into student engagement and performance." />
              </ProtectedRoute>
            } />

            {/* Admin Route (Hidden) */}
            <Route path="/admin" element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
