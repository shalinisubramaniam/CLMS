import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  Users, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="bg-white border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-6">
              Explore Our <span className="text-indigo-600">Course Catalog</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
              Master new skills with our professional-grade courses, taught by industry experts and enhanced by AI.
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search courses, skills, or instructors..." 
                className="pl-12 h-14 text-lg shadow-lg border-slate-200 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              <span className="text-slate-700 font-semibold">{filteredCourses.length} courses found</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2 h-11 border-slate-200 bg-white">
                <Filter size={18} />
                Filter
              </Button>
              <select className="h-11 px-4 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:ring-indigo-500">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[420px] bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                <Card key={course._id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-xl transition-all group rounded-3xl">
                  <div className="h-52 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                        {course.category || "New"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">
                      <BookOpen size={14} className="text-indigo-500" />
                      12 Lessons
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[2.5rem]">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-indigo-600 border border-slate-200">
                        {course.instructor?.name?.[0] || "I"}
                      </div>
                      <span className="text-sm font-medium text-slate-700">By {course.instructor?.name || "Expert Instructor"}</span>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Price</span>
                        <span className="text-2xl font-black text-slate-900">${course.price}</span>
                      </div>
                      <Link to={`/course/${course._id}`}>
                        <Button size="lg" className="rounded-2xl px-6 h-12 shadow-md shadow-indigo-600/20 group">
                          View Course
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No courses matching your search</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
                  <Button variant="ghost" className="mt-6 text-indigo-600" onClick={() => setSearchQuery("")}>Clear all search</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
