import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  BrainCircuit,
  MessageSquare,
  Award
} from "lucide-react";

export default function CoursePlayer() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error("Fetch course error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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

  // Use dummy modules if none exist (for seed data)
  const modules = course.modules?.length > 0 ? course.modules : [
    {
      title: "Module 1: Introduction",
      lessons: [
        { title: "Course Overview", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { title: "Getting Started", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
      ],
      quiz: { questions: [1, 2, 3] }
    },
    {
      title: "Module 2: Core Concepts",
      lessons: [
        { title: "Deep Dive into Syntax", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { title: "Working with Data", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
      ]
    }
  ];

  const currentModule = modules[activeModule];
  const currentLesson = currentModule?.lessons?.[activeLesson];

  return (
    <Layout>
      <div className="bg-slate-900 min-h-[calc(100vh-64px)] text-white">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row h-full">
          {/* Video Player Area */}
          <div className="flex-grow p-4 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/student/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white border border-white/10" asChild>
                  <Link to="/ai-assistant" className="gap-2">
                    <BrainCircuit size={16} />
                    AI Assistant
                  </Link>
                </Button>
                <div className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full text-indigo-300 border border-indigo-500/30">
                  {Math.round((activeModule / modules.length) * 100)}% Complete
                </div>
              </div>
            </div>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group">
              {currentLesson ? (
                <iframe
                  className="w-full h-full"
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-bold text-xl uppercase tracking-widest">
                  Select a lesson to begin
                </div>
              )}
            </div>

            <div className="mt-8">
              <h1 className="text-2xl font-bold tracking-tight">{currentLesson?.title || course.title}</h1>
              <div className="flex items-center gap-6 mt-4 pb-8 border-b border-white/5">
                <button className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  <FileText size={18} />
                  Download Notes (PDF)
                </button>
                <button className="flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-colors">
                  <MessageSquare size={18} />
                  Discussions
                </button>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-3">About this lesson</h3>
                <p className="text-slate-400 leading-relaxed max-w-4xl">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Playlist */}
          <div className="w-full lg:w-[400px] bg-slate-800/50 border-l border-white/5 overflow-y-auto">
            <div className="p-6 border-b border-white/5 bg-slate-800">
              <h2 className="font-bold text-lg">Course Content</h2>
              <p className="text-slate-400 text-xs mt-1">{modules.length} Modules • 24 Lessons</p>
            </div>
            <div className="p-2">
              {modules.map((module: any, mIdx: number) => (
                <div key={mIdx} className="mb-2">
                  <button 
                    onClick={() => setActiveModule(mIdx)}
                    className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all group ${
                      activeModule === mIdx ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeModule === mIdx ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'}`}>
                        <PlayCircle size={16} />
                      </div>
                      <span className="font-bold text-sm tracking-wide">{module.title}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${activeModule === mIdx ? 'rotate-90 text-indigo-300' : 'text-slate-500'}`} />
                  </button>
                  
                  {activeModule === mIdx && (
                    <div className="mt-1 space-y-1 px-4 py-2 border-l-2 border-indigo-600/30 ml-8">
                      {module.lessons?.map((lesson: any, lIdx: number) => (
                        <button
                          key={lIdx}
                          onClick={() => setActiveLesson(lIdx)}
                          className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                            activeLesson === lIdx && activeModule === mIdx ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{lIdx + 1}. {lesson.title}</span>
                          {lIdx < activeLesson && <CheckCircle2 size={14} className="text-emerald-400" />}
                        </button>
                      ))}
                      {module.quiz && (
                        <Link 
                          to={`/quiz/${course._id}?module=${mIdx}`}
                          className="w-full text-left p-3 rounded-lg text-sm font-bold text-amber-400 flex items-center gap-2 hover:bg-amber-400/10 transition-colors mt-2"
                        >
                          <Award size={16} />
                          Module Quiz
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
