import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  Clock, 
  PlayCircle, 
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, recRes] = await Promise.all([
          fetch("/api/my-courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
          fetch("/api/recommendations", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
        ]);

        if (courseRes.ok) setCourses(await courseRes.json());
        if (recRes.ok) setRecommendations(await recRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-slate-500 mt-2">Pick up where you left off and continue your learning journey.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Courses Enrolled", value: courses.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Points", value: user?.points || 0, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Badges Earned", value: user?.badges?.length || 0, icon: Trophy, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Learning Streak", value: `${user?.streaks || 0} days`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
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
          {/* Main Column: Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Enrolled Courses</h2>
              <Link to="/courses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                Browse More <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {courses.length > 0 ? courses.map((course) => (
                <Card key={course._id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-32 flex-shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {course.category || "General"}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mt-1">{course.title}</h3>
                          </div>
                          <Link to={`/course/${course._id}`}>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                              <PlayCircle size={24} />
                            </Button>
                          </Link>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Progress</span>
                            <span className="font-medium text-slate-900">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <BookOpen size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
                  <p className="text-slate-500 mt-2 mb-6">Explore our catalog to find your next favorite course.</p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Side Column: Recent Activity & Badges */}
          <div className="space-y-8">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <CardDescription>Your latest learning actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { text: "Completed 'Intro to React' quiz", time: "2 hours ago", icon: Trophy, color: "text-amber-500" },
                    { text: "Watched 'JSX Fundamentals' video", time: "5 hours ago", icon: PlayCircle, color: "text-blue-500" },
                    { text: "Enrolled in 'Advanced Node.js'", time: "Yesterday", icon: BookOpen, color: "text-indigo-500" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`mt-1 flex-shrink-0 ${activity.color}`}>
                        <activity.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 leading-snug">{activity.text}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Clock size={12} /> {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Unclaimed Reward</h3>
                </div>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  You've earned 50 bonus points for completing your 7-day streak!
                </p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold">
                  Claim Points
                </Button>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            {recommendations && recommendations.courses?.length > 0 && (
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-slate-900 text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 scale-150">
                  <Sparkles size={120} className="text-indigo-500" />
                </div>
                <CardHeader className="relative z-10 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    Personalized For You
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    {recommendations.reason}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 pt-4">
                  {recommendations.courses.map((course: any) => (
                    <Link key={course._id} to={`/course/${course._id}`} className="flex gap-4 items-center group">
                      <img src={course.thumbnail} className="h-12 w-16 object-cover rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                      <div className="flex-grow">
                        <p className="text-sm font-bold truncate group-hover:text-indigo-300 transition-colors">{course.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{course.category}</p>
                      </div>
                    </Link>
                  ))}
                  <Button variant="ghost" className="w-full text-indigo-400 font-bold hover:text-indigo-300 hover:bg-white/5 mt-2" asChild>
                    <Link to="/courses">Browse Catalog</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
