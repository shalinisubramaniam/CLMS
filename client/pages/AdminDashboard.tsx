import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  ShieldAlert, 
  BarChart3, 
  Settings, 
  Trash2, 
  CheckCircle,
  MoreVertical,
  Flag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch("/api/admin/users", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
          fetch("/api/courses")
        ]);
        
        if (usersRes.ok && coursesRes.ok) {
          setUsers(await usersRes.json());
          setCourses(await coursesRes.json());
        }
      } catch (error) {
        console.error("Fetch admin data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        toast({ title: "User deleted successfully" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to delete user" });
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to remove this course?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setCourses(courses.filter(c => c._id !== id));
        toast({ title: "Course removed from platform" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to remove course" });
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldAlert size={36} className="text-rose-600" />
              Platform Administration
            </h1>
            <p className="text-slate-500 font-medium mt-2">Oversee all users, courses, and platform health.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 h-11 border-slate-200">
              <Settings size={18} />
              System Config
            </Button>
            <Button className="gap-2 h-11 bg-rose-600 hover:bg-rose-700">
              <ShieldAlert size={18} />
              Security Logs
            </Button>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Platform Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Live Courses", value: courses.length, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Flagged Content", value: "3", icon: Flag, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Active Revenue", value: "$12.4K", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* User Management */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-8 px-8 border-b border-slate-50 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black text-slate-900">Manage Users</CardTitle>
                <CardDescription className="font-medium text-slate-400">Suspend, delete, or verify user accounts.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    {users.slice(0, 6).map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500 font-medium capitalize">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                              <CheckCircle size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => deleteUser(user._id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Course Oversight */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-8 px-8 border-b border-slate-50 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black text-slate-900">Manage Courses</CardTitle>
                <CardDescription className="font-medium text-slate-400">Review content and remove reported courses.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    {courses.slice(0, 6).map((course) => (
                      <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={course.thumbnail} className="h-10 w-16 object-cover rounded-lg border border-slate-200" alt={course.title} />
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{course.title}</p>
                              <p className="text-xs text-slate-500 font-medium">By {course.instructor?.name || "Unknown"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                              <MoreVertical size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => deleteCourse(course._id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
