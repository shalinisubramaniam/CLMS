import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, ArrowRight, Loader2, User, Users } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        toast({
          title: "Account Created!",
          description: `Welcome to CLMS, ${data.user.name}!`,
        });
        
        if (data.user.role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: data.message || "Could not create account",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
              <BookOpen size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-8 py-10 shadow-xl rounded-2xl border border-slate-100 ring-1 ring-slate-900/5">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
                    role === "student" 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <User size={16} />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("instructor")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
                    role === "instructor" 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Users size={16} />
                  Instructor
                </button>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="mt-2">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-10 text-center text-xs text-slate-500">
              By signing up, you agree to our{" "}
              <a href="#" className="font-semibold text-slate-600 underline">Terms of Service</a> and{" "}
              <a href="#" className="font-semibold text-slate-600 underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
