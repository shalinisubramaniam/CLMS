import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  BarChart3,
  CheckCircle2,
  Star,
  Clock,
  Award
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          
          // Check if user is enrolled
          if (user) {
            const enrolledResponse = await fetch("/api/my-courses", {
              headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (enrolledResponse.ok) {
              const enrolledCourses = await enrolledResponse.json();
              const isEnrolled = enrolledCourses.some((c: any) => c._id === id);
              setEnrolled(isEnrolled);
            }
          }
        }
      } catch (error) {
        console.error("Fetch course error:", error);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/payment/${id}`);
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    </Layout>
  );

  if (!course) return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Button asChild className="mt-4"><Link to="/courses">Back to Catalog</Link></Button>
      </div>
    </Layout>
  );

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalModules = course.modules?.length || 0;

  return (
    <Layout>
      <div className="bg-slate-900 text-white">
        {/* Hero Section */}
        <div className="min-h-[500px] relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/courses" className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium mb-8 transition-colors">
              <ArrowLeft size={16} />
              Back to Courses
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
              {/* Left: Content */}
              <div className="lg:col-span-2">
                <div className="inline-block">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-5xl font-black leading-tight mb-6">{course.title}</h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">{course.description}</p>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg border-2 border-white">
                    {course.instructor?.name?.[0] || "I"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{course.instructor?.name || "Expert Instructor"}</p>
                    <p className="text-sm text-slate-400">Course Instructor</p>
                  </div>
                </div>
              </div>

              {/* Right: Enrollment Card */}
              <Card className="bg-slate-800/80 border-slate-700 shadow-2xl backdrop-blur sticky top-8">
                <CardContent className="p-8">
                  <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-slate-400 mb-1">Price</div>
                    <div className="text-4xl font-black text-white">₹{course.price.toLocaleString('en-IN')}</div>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  {enrolled ? (
                    <Link to={`/course/${id}`} className="w-full block">
                      <Button size="lg" className="w-full rounded-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                        Go to Course
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleEnroll}
                      className="w-full rounded-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      Enroll Now
                    </Button>
                  )}

                  <Button variant="outline" size="sm" className="w-full mt-3 rounded-lg border-slate-600 text-slate-300 hover:bg-slate-700" asChild>
                    <Link to="/courses">Browse More Courses</Link>
                  </Button>

                  <div className="border-t border-slate-700 mt-8 pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen size={18} className="text-indigo-400" />
                      <span><strong>{totalModules}</strong> {totalModules === 1 ? "Module" : "Modules"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BarChart3 size={18} className="text-indigo-400" />
                      <span><strong>{totalLessons}</strong> {totalLessons === 1 ? "Lesson" : "Lessons"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={18} className="text-indigo-400" />
                      <span><strong>Self-paced</strong> Learning</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award size={18} className="text-indigo-400" />
                      <span>Earn <strong>Badges</strong> & Points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Course Content Section */}
        <div className="bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black mb-12">What you'll learn</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {[
                "Master the core concepts and best practices",
                "Build real-world projects from scratch",
                "Learn industry-standard tools and frameworks",
                "Get hands-on experience with practical examples",
                "Understand advanced techniques and patterns",
                "Prepare for professional development roles"
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <CheckCircle2 size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            {/* Course Modules Preview */}
            {course.modules && course.modules.length > 0 && (
              <>
                <h2 className="text-3xl font-black mb-8 mt-16">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.modules.map((module: any, idx: number) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-600/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-600/20 p-3 rounded-lg">
                            <BookOpen size={20} className="text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{module.title}</h3>
                            <p className="text-slate-400 text-sm">{module.lessons?.length || 0} lessons</p>
                          </div>
                        </div>
                        <div className="text-slate-400">
                          →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
