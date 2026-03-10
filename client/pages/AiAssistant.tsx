import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  FileText, 
  History,
  Loader2,
  BrainCircuit
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI study assistant. How can I help you with your courses today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        toast({
          variant: "destructive",
          title: "AI error",
          description: data.message || "Failed to get AI response"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not reach the AI service"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!summaryText.trim() || summarizing) return;
    setSummarizing(true);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text: summaryText }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `### Summary of your notes:\n\n${data.summary}` 
        }]);
        toast({ title: "Summary generated!" });
        setSummaryText("");
      } else {
        toast({
          variant: "destructive",
          title: "AI error",
          description: data.message || "Failed to generate summary"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not reach the AI service"
      });
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Study Companion</h1>
              <p className="text-sm text-slate-500">Intelligent learning assistance at your fingertips</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-slate-200">
              <History size={16} />
              History
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200">
              <Sparkles size={16} className="text-amber-500" />
              Advanced Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-hidden">
          {/* Main Chat area */}
          <Card className="lg:col-span-2 flex flex-col border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot size={20} className="text-indigo-600" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'}`}>
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'assistant' 
                    ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-slate">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {line.startsWith('###') ? <strong className="text-lg">{line.replace('###', '')}</strong> : line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 rounded-tl-none border border-slate-100 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                    <span className="text-sm text-slate-500 font-medium tracking-wide">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  placeholder="Ask a question about your course..." 
                  className="bg-white border-slate-200 h-12 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shadow-md" disabled={isLoading || !input.trim()}>
                  <Send size={20} />
                </Button>
              </form>
            </div>
          </Card>

          {/* Tools / Sidebar */}
          <div className="space-y-6 overflow-y-auto pr-2">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600" />
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-500">Paste your lecture notes or transcript below to get a structured summary.</p>
                <textarea 
                  className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  placeholder="Paste text here..."
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                />
                <Button 
                  className="w-full gap-2 font-semibold" 
                  onClick={handleSummarize}
                  disabled={summarizing || !summaryText.trim()}
                >
                  {summarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate Summary
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Explain Quick Sort algorithm",
                    "How do React Hooks work?",
                    "What are ACID properties?",
                    "Difference between SQL and NoSQL"
                  ].map((suggestion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="w-full text-left text-sm p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all font-medium flex items-center justify-between group shadow-sm"
                    >
                      {suggestion}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
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

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
