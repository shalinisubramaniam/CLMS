import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          setCourse(await response.json());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/course/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        navigate("/student/dashboard");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to={`/course-detail/${courseId}`} className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            ← Back to course details
          </Link>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment</h1>
            <p className="text-slate-500 mb-6">Complete your enrollment for {course?.title}</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <span className="text-slate-700 font-medium">Course Fee</span>
              <span className="text-2xl font-bold text-slate-900">₹{course?.price?.toLocaleString("en-IN")}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiry</label>
                  <Input
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                  <Input
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700" disabled={processing}>
                {processing ? "Processing..." : `Pay & Enroll Now`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
