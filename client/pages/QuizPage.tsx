import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Clock,
  Zap,
  RotateCcw
} from "lucide-react";

export default function QuizPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const moduleIdx = parseInt(searchParams.get("module") || "0");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

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

  // Mock quiz data if none exist
  const mockQuestions = [
    {
      question: "What is the primary purpose of React Hooks?",
      options: [
        "To replace class components entirely",
        "To allow using state and other features in functional components",
        "To improve application security",
        "To handle database connections"
      ],
      correctAnswer: 1
    },
    {
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useContext", "useEffect", "useReducer"],
      correctAnswer: 2
    },
    {
      question: "What does the 'M' in MERN stand for?",
      options: ["MySQL", "MongoDB", "MariaDB", "Memory"],
      correctAnswer: 1
    }
  ];

  const quiz = course?.modules?.[moduleIdx]?.quiz || { questions: mockQuestions };
  const questions = quiz.questions;
  const currentQ = questions[currentQuestion];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;
    
    // Check answer
    const correct = selectedOption === currentQ.correctAnswer;
    if (correct) {
      setScore(prev => prev + 1);
    }

    setIsAnswered(true);
    
    // Wait briefly to show feedback
    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Quiz Finished
        setIsFinished(true);
        await saveResult(correct ? score + 1 : score);
      }
    }, 1500);
  };

  const saveResult = async (finalScore: number) => {
    setSaving(true);
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    try {
      const response = await fetch("/api/quiz/results", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          quizId: course.modules?.[moduleIdx]?._id || id,
          courseId: id,
          score: percentage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Quiz Result Saved!",
          description: `You earned ${data.pointsAdded} points.`
        });
      }
    } catch (error) {
      console.error("Save result error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-2xl text-amber-500 mb-8 animate-bounce">
              <Trophy size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Quiz Completed!</h1>
            <p className="text-slate-500 text-lg mb-8">Great job finishing the {course?.title} quiz.</p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-50 p-6 rounded-3xl">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                <p className="text-4xl font-black text-indigo-600">{percentage}%</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                <p className="text-4xl font-black text-slate-900">{score}/{questions.length}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-600/20" asChild>
                <Link to={`/course/${id}`}>Return to Course</Link>
              </Button>
              <Button variant="outline" size="lg" className="flex-1 h-14 rounded-2xl text-lg font-bold border-slate-200" onClick={() => window.location.reload()}>
                <RotateCcw className="mr-2" size={20} />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl border border-slate-200" asChild>
              <Link to={`/course/${id}`}><ArrowLeft size={20} /></Link>
            </Button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{course?.title}</h2>
              <p className="text-sm text-slate-500 font-medium">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-bold border border-indigo-100 shadow-sm">
            <Clock size={18} />
            <span className="tabular-nums">12:45</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-12 overflow-hidden shadow-inner border border-slate-200">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-700 ease-out shadow-lg" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
          <CardHeader className="pt-10 px-10 pb-6 text-center">
            <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm ring-1 ring-indigo-500/10">
              <Zap size={24} className="fill-indigo-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-4">
              {currentQ.options.map((option: string, idx: number) => {
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswered && idx === currentQ.correctAnswer;
                const isWrong = isAnswered && isSelected && idx !== currentQ.correctAnswer;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all group flex items-center justify-between font-bold text-lg ${
                      isCorrect 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10' 
                        : isWrong
                          ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-lg shadow-rose-500/10'
                          : isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                            : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="flex-grow">{option}</span>
                    {isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                    {isWrong && <XCircle className="text-rose-500" size={24} />}
                    {!isAnswered && (
                      <div className={`h-6 w-6 rounded-full border-2 transition-colors ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 group-hover:border-indigo-300'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex justify-end">
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-indigo-600/30 group" 
                onClick={handleNext}
                disabled={selectedOption === null || isAnswered}
              >
                Next Question
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
