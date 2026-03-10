import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import Courses from "./pages/Courses";
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
            <Route path="/course/:id" element={<PlaceholderPage title="Course Player" description="Watch video lessons and take notes." />} />
            <Route path="/quiz/:id" element={<PlaceholderPage title="Quiz Page" description="Test your knowledge with auto-graded quizzes." />} />
            <Route path="/ai-assistant" element={<PlaceholderPage title="AI Assistant" description="Ask questions and get instant explanations." />} />
            <Route path="/leaderboard" element={<PlaceholderPage title="Leaderboard" description="See how you rank against other learners." />} />

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/create-course" element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <PlaceholderPage title="Create Course" />
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
                <PlaceholderPage title="Admin Panel" description="Manage users, courses, and platform-wide analytics." />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
