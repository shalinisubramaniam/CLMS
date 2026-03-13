import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  Award,
  Download,
  Send,
  Loader2,
  Clock
} from "lucide-react";

export default function CoursePlayer() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [courseRes, progressRes, discussionsRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch(`/api/courses/${id}/progress`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`/api/discussions/${id}`)
        ]);

        if (courseRes.ok) setCourse(await courseRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
        if (discussionsRes.ok) setDiscussions(await discussionsRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentModule = course.modules[activeModule];
      const currentLesson = currentModule.lessons[activeLesson];
      
      const response = await fetch("/api/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: id,
          moduleId: currentModule._id,
          lessonId: currentLesson._id
        })
      });

      if (response.ok) {
        toast({ title: "Lesson completed! +10 points earned" });
        // Refresh progress
        const progressRes = await fetch(`/api/courses/${id}/progress`, { headers: { "Authorization": `Bearer ${token}` } });
        if (progressRes.ok) setProgress(await progressRes.json());
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error marking lesson complete" });
    }
  };

  const handleDownloadNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/courses/${id}/notes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        window.open(data.notesUrl, '_blank');
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to download notes" });
    }
  };

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionTitle.trim() || !discussionContent.trim()) return;

    setPosting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: id,
          title: discussionTitle,
          content: discussionContent
        })
      });

      if (response.ok) {
        const newDiscussion = await response.json();
        setDiscussions([newDiscussion, ...discussions]);
        setDiscussionTitle("");
        setDiscussionContent("");
        toast({ title: "Discussion posted!" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to post discussion" });
    } finally {
      setPosting(false);
    }
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

  const modules = course.modules?.length > 0 ? course.modules : [];
  const currentModule = modules[activeModule];
  const currentLesson = currentModule?.lessons?.[activeLesson];
  const completedLessonIds = progress?.completedLessonIds || [];
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <Layout>
      <div className="bg-slate-900 min-h-[calc(100vh-64px)] text-white">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
          {/* Video Player Area */}
          <div className="flex-grow lg:flex-[3] p-4 lg:p-8">
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
                  {progressPercentage}% Complete
                </div>
              </div>
            </div>

            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group mb-8">
              {currentLesson ? (
                <video
                  key={currentLesson._id}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-cover rounded-2xl"
                  poster={course.thumbnail}
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                  <div className="flex items-center justify-center h-96 text-slate-400 font-semibold">
                    Your browser does not support the video tag. Please try a different browser.
                  </div>
                </video>
              ) : (
                <div className="flex items-center justify-center h-96 text-slate-500 font-bold text-xl uppercase tracking-widest">
                  Select a lesson to begin
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">{currentLesson?.title || course.title}</h1>
              <div className="flex items-center gap-6 mt-4 pb-8 border-b border-white/5 flex-wrap">
                <button onClick={handleMarkComplete} className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  <CheckCircle2 size={18} />
                  {completedLessonIds.includes(currentLesson?._id) ? "Completed" : "Mark Complete"}
                </button>
                <button onClick={handleDownloadNotes} className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  <Download size={18} />
                  Download Notes
                </button>
                <button className="flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-colors">
                  <MessageSquare size={18} />
                  Discussions
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-3">About this lesson</h3>
                <p className="text-slate-400 leading-relaxed max-w-4xl">
                  {currentLesson?.description || course.description}
                </p>
                {currentLesson?.duration && (
                  <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={16} />
                    <span>Duration: {Math.floor(currentLesson.duration / 60)} minutes</span>
                  </div>
                )}
              </div>

              {/* Discussions Section */}
              <div className="mt-12 border-t border-white/5 pt-8">
                <h3 className="text-xl font-bold text-white mb-6">Course Discussions</h3>

                {/* Post New Discussion */}
                <Card className="bg-slate-800 border-slate-700 mb-8">
                  <CardContent className="p-6">
                    <form onSubmit={handlePostDiscussion} className="space-y-4">
                      <Input
                        placeholder="Discussion title..."
                        className="bg-slate-900 border-slate-600 text-white placeholder-slate-500 h-10"
                        value={discussionTitle}
                        onChange={(e) => setDiscussionTitle(e.target.value)}
                      />
                      <textarea
                        placeholder="Share your thoughts or ask a question..."
                        className="w-full h-24 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={discussionContent}
                        onChange={(e) => setDiscussionContent(e.target.value)}
                      />
                      <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" disabled={posting}>
                        {posting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        Post Discussion
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* List Discussions */}
                <div className="space-y-4">
                  {discussions.length > 0 ? (
                    discussions.map((discussion: any) => (
                      <Card key={discussion._id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-bold text-white">{discussion.title}</h4>
                            <span className="text-xs text-slate-400">{discussion.userName}</span>
                          </div>
                          <p className="text-slate-300 mb-4">{discussion.content}</p>
                          {discussion.replies?.length > 0 && (
                            <div className="ml-4 pt-4 border-l-2 border-slate-600 space-y-3">
                              {discussion.replies.map((reply: any, idx: number) => (
                                <div key={idx} className="text-sm">
                                  <p className="text-indigo-400 font-bold">{reply.userName}</p>
                                  <p className="text-slate-300">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No discussions yet. Start one!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Playlist */}
          <div className="w-full lg:w-[400px] bg-slate-800/50 border-l border-white/5 overflow-y-auto max-h-[calc(100vh-64px)]">
            <div className="p-6 border-b border-white/5 bg-slate-800">
              <h2 className="font-bold text-lg">Course Content</h2>
              <p className="text-slate-400 text-xs mt-1">{modules.length} Modules • {modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Lessons</p>
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
                          {completedLessonIds.includes(lesson._id) && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
                        </button>
                      ))}
                      {module.quiz && (
                        <Link 
                          to={`/quiz/${id}?module=${mIdx}`}
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
