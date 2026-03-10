import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  Plus, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  Loader2
} from "lucide-react";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          title, 
          description, 
          thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop", 
          price: Number(price) || 0, 
          category: category || "Uncategorized" 
        }),
      });

      if (response.ok) {
        toast({
          title: "Course Created!",
          description: "Your course is now live. Now let's add some modules."
        });
        navigate("/instructor/dashboard");
      } else {
        const data = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to create course"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not reach the server"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <button 
            onClick={() => navigate("/instructor/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Design New Course</h1>
              <p className="text-slate-500 font-medium">Create the structure for your knowledge journey.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-900/5">
            <CardHeader className="pt-10 px-10 pb-6 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Upload size={20} className="text-indigo-600" />
                Course Details
              </CardTitle>
              <CardDescription className="font-medium text-slate-400">Fill in the primary information about your course.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Course Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Master the MERN Stack in 30 Days" 
                    className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-indigo-500 px-6 font-bold text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Course Description</Label>
                  <textarea 
                    id="description" 
                    placeholder="Describe what students will learn in your course..." 
                    className="w-full h-40 bg-slate-50/50 border border-slate-100 rounded-[2rem] focus:ring-indigo-500 p-6 font-medium text-slate-600 resize-none outline-none focus:border-indigo-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Price (USD)</Label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="49" 
                      className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-indigo-500 pl-10 pr-6 font-bold"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Category</Label>
                  <div className="relative">
                    <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="category" 
                      placeholder="Web Development" 
                      className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-indigo-500 pl-10 pr-6 font-bold"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="thumbnail" className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Thumbnail URL</Label>
                  <div className="relative">
                    <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="thumbnail" 
                      placeholder="https://images.unsplash.com/..." 
                      className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-indigo-500 pl-10 pr-6 font-medium"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-400 ml-2">Recommended size: 1200x800px. Leave blank for default.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-16 px-12 rounded-2xl text-lg font-black shadow-xl shadow-indigo-600/30 group" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={20} />
                  )}
                  Create Course Structure
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
