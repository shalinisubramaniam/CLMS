import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  MoreVertical,
  BarChart3,
  Video
} from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses created by this instructor
    const fetchMyCourses = async () => {
      try {
        const response = await fetch("/api/courses", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter courses where instructor is this user (assuming populated or id)
          setMyCourses(data.filter((c: any) => (c.instructor._id === user?.id || c.instructor === user?.id)));
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage your teaching portfolio and track your success.</p>
          </div>
          <Button asChild className="h-11 shadow-md shadow-indigo-600/20">
            <Link to="/instructor/create-course" className="flex items-center gap-2">
              <Plus size={18} />
              Create New Course
            </Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Students", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Courses Created", value: myCourses.length, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Total Revenue", value: "$4,850", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Course Engagement", value: "85%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, idx) => (
            <Card key={idx} className="border-slate-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Course List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Your Courses</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {myCourses.length > 0 ? myCourses.map((course) => (
                <Card key={course._id} className="overflow-hidden border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm rounded-lg">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">{course.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Users size={14} /> 245</span>
                      <span className="flex items-center gap-1.5"><Video size={14} /> 12 Lessons</span>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                      <p className="font-bold text-slate-900">${course.price}</p>
                      <Link to={`/instructor/analytics/${course._id}`} className="text-sm font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-500">
                        View Analytics <ArrowRight size={14} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <BookOpen size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
                  <p className="text-slate-500 mt-2 mb-6">Share your knowledge with the world. Create your first course today.</p>
                  <Button asChild>
                    <Link to="/instructor/create-course">Create Course</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Side Column: Quick Actions & Student Feed */}
          <div className="space-y-8">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50" asChild>
                  <Link to="/instructor/create-course">
                    <Plus size={18} className="text-indigo-600" />
                    New Course
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50">
                  <Video size={18} className="text-indigo-600" />
                  Upload Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50">
                  <BarChart3 size={18} className="text-indigo-600" />
                  Global Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">New Students</CardTitle>
                  <Link to="/instructor/students" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">View All</Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[
                    { name: "Alex Rivers", course: "Intro to React", time: "10m ago" },
                    { name: "Maya Chen", course: "Advanced Node.js", time: "2h ago" },
                    { name: "Liam Smith", course: "Intro to React", time: "5h ago" },
                    { name: "Sofia Garcia", course: "UI Design Principles", time: "Yesterday" },
                  ].map((student, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-200">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 leading-none">{student.name}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">Enrolled in {student.course}</p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase">{student.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
