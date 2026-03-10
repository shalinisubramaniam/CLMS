import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Download,
  Share2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";

export default function InstructorAnalytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, analyticsRes] = await Promise.all([
          fetch(`/api/courses/${id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
          fetch(`/api/analytics/course/${id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
        ]);
        
        if (courseRes.ok && analyticsRes.ok) {
          const courseData = await courseRes.json();
          const analyticsData = await analyticsRes.json();
          setCourse(courseData);
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error("Fetch analytics error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    </Layout>
  );

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50/50 min-h-screen">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-xl border border-slate-200">
              <Link to="/instructor/dashboard"><ArrowLeft size={20} /></Link>
            </Button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics: {course?.title}</h1>
              <p className="text-slate-500 font-medium">Detailed performance and engagement metrics.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 h-11 border-slate-200">
              <Download size={18} />
              Export CSV
            </Button>
            <Button variant="outline" className="gap-2 h-11 border-slate-200">
              <Share2 size={18} />
              Share Report
            </Button>
          </div>
        </header>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Enrollments", value: analytics.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Avg. Quiz Score", value: `${analytics.averageQuizScore}%`, icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Engagement Rate", value: "78%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active Today", value: "24", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, idx) => (
            <Card key={idx} className="border-none shadow-xl rounded-3xl overflow-hidden ring-1 ring-slate-900/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Engagement Chart */}
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-8 px-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" />
                Student Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.engagementData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#6366f1" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-8 px-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.scoreDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={45} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="flex items-center gap-3 text-indigo-700 font-bold mb-2">
                  <AlertCircle size={18} />
                  Instructor Insight
                </div>
                <p className="text-sm text-indigo-600/80 leading-relaxed font-medium">
                  The 61-80% range is your most common score. Consider adding more advanced material to challenge top performers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Difficult Topics */}
          <Card className="lg:col-span-3 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-8 px-8 border-b border-slate-50 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black text-slate-900">Improvement Opportunities</CardTitle>
                <CardDescription className="font-medium text-slate-400">Topics where students struggled the most in quizzes.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.difficultTopics.map((topic: string, idx: number) => (
                  <div key={idx} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500 mb-4 ring-1 ring-slate-900/5">
                      <AlertCircle size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">{topic}</h4>
                    <p className="text-xs text-slate-500 font-medium mb-6 uppercase tracking-widest">34% Success Rate</p>
                    <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl" asChild>
                      <Link to="/ai-assistant">
                        Generate Quiz with AI
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
