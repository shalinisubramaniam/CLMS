import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Medal, 
  Zap, 
  TrendingUp, 
  Award, 
  Sparkles,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Leaderboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error("Fetch leaderboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 text-amber-600 rounded-2xl mb-6 shadow-sm ring-1 ring-amber-500/20">
              <Trophy size={32} className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Learner Leaderboard</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
              Celebrate the top performers in our community. Every quiz and lesson completed brings you closer to the top!
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Top 3 Podium (Visualized differently) */}
            {students.slice(0, 3).map((student, idx) => (
              <Card key={student._id} className={`border-none shadow-xl rounded-[2.5rem] overflow-hidden ${
                idx === 0 ? 'bg-indigo-600 text-white scale-105' : 'bg-white text-slate-900'
              }`}>
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
                      idx === 0 ? 'bg-white/20 border-white/30' : 'bg-slate-100 border-slate-50 text-slate-400'
                    }`}>
                      {student.name[0]}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center shadow-lg ${
                      idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-700' : 'bg-orange-300 text-orange-900'
                    }`}>
                      <Medal size={16} />
                    </div>
                  </div>
                  <h3 className="font-black text-lg truncate w-full">{student.name}</h3>
                  <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm ${
                    idx === 0 ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Zap size={14} fill="currentColor" />
                    {student.points} Points
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">Rankings</h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Find student..." className="pl-10 h-10 rounded-xl bg-slate-50 border-none focus:ring-indigo-500" />
              </div>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <th className="px-8 py-4">Rank</th>
                      <th className="px-8 py-4">Learner</th>
                      <th className="px-8 py-4 text-center">Badges</th>
                      <th className="px-8 py-4 text-center">Streak</th>
                      <th className="px-8 py-4 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((student, idx) => (
                      <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-black text-sm ${
                            idx < 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600 border border-slate-200">
                              {student.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500 font-medium">Joined {new Date().getFullYear()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex justify-center gap-1">
                            {student.badges?.slice(0, 3).map((badge: string, bIdx: number) => (
                              <div key={bIdx} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg" title={badge}>
                                <Award size={14} />
                              </div>
                            ))}
                            {student.badges?.length > 3 && (
                              <span className="text-[10px] font-bold text-slate-400 self-end mb-1">+{student.badges.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                            <Sparkles size={12} fill="currentColor" />
                            {student.streaks || 0}d
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="font-black text-slate-900">{student.points.toLocaleString()}</span>
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
