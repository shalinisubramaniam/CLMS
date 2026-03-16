import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Users, 
  Trophy, 
  Zap, 
  Shield, 
  BarChart3,
  Bot
} from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10 bg-indigo-50 mb-8">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="fill-indigo-600" />
              Revolutionize your learning with AI
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
            The Comprehensive Learning <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Management System</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
            A fully functional MERN stack platform designed for the modern era. 
            Personalized AI assistance, advanced analytics, and interactive learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold group" asChild>
              <Link to="/signup">
                Get Started for Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-32">
            <div className="relative rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                alt="App screenshot"
                className="rounded-lg shadow-2xl ring-1 ring-slate-900/10 w-full object-cover max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wide">Key Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to excel</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "AI Study Assistant",
                description: "Ask questions and get instant, accurate explanations based on course material.",
                icon: Bot,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Personalized Analytics",
                description: "Track your progress with detailed charts and identify areas for improvement.",
                icon: BarChart3,
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                title: "Gamified Experience",
                description: "Earn points, unlock badges, and climb the leaderboard as you learn.",
                icon: Trophy,
                color: "bg-amber-50 text-amber-600"
              },
              {
                title: "Interactive Quizzes",
                description: "Test your knowledge with auto-graded quizzes and get instant feedback.",
                icon: Zap,
                color: "bg-purple-50 text-purple-600"
              },
              {
                title: "Instructor Dashboard",
                description: "Powerful tools for instructors to create courses and track student success.",
                icon: Users,
                color: "bg-rose-50 text-rose-600"
              },
              {
                title: "Internal Admin Control",
                description: "Secure administrative oversight to ensure high-quality platform content.",
                icon: Shield,
                color: "bg-indigo-50 text-indigo-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start p-6 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className={`p-3 rounded-xl mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                Designed for Students, <br /> Built for Instructors
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our platform bridges the gap between learning and teaching with intuitive tools and innovative AI features.
              </p>
              <ul className="space-y-4">
                {[
                  "Automated Quiz Generation from notes",
                  "AI-driven Course Recommendations",
                  "Comprehensive Learning Analytics",
                  "Real-time Study Assistant"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle size={20} className="text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button size="lg" asChild>
                  <Link to="/signup">Start Your Journey Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-indigo-600 rounded-3xl p-1 shadow-2xl rotate-3 scale-95 lg:scale-100">
                <div className="bg-white rounded-[22px] p-8 -rotate-3">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    <Zap size={20} fill="currentColor" />
                    <Zap size={20} fill="currentColor" />
                    <Zap size={20} fill="currentColor" />
                    <Zap size={20} fill="currentColor" />
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <blockquote className="text-xl font-medium text-slate-900 mb-6 italic">
                    "This LMS has completely transformed how I handle my course materials. The AI quiz generator saves me hours of work every week!"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                    <div>
                      <p className="font-bold text-slate-900">Dr. Thanga Parvathi</p>
                      <p className="text-slate-500 text-sm">Computer Science Professor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 sm:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 pointer-events-none"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 relative z-10">Ready to start your learning adventure?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of students and instructors on the most advanced MERN stack LMS available today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-indigo-400 hover:bg-indigo-400/10" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
