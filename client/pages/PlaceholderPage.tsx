import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function PlaceholderPage({ title, description }: { title: string, description?: string }) {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">{title}</h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {description || "This page is currently being built. Stay tuned for more features!"}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            {user && (
               <Button variant="outline" asChild>
                <Link to={user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'}>
                  Go to Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
