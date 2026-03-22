import { RequestHandler } from "express";
import PDFDocument from "pdfkit";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Activities";
import { Progress } from "../models/Progress";
import { User } from "../models/User";

export const handleGetCertificate: RequestHandler = async (req, res) => {
  const { courseId } = req.params;
  const userId = (req as any).user.userId;

  try {
    const [course, user] = await Promise.all([
      Course.findById(courseId).populate("instructor", "name"),
      User.findById(userId).select("name")
    ]);

    if (!course || !user) {
      return res.status(404).json({ message: "Course or user not found" });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must enroll in the course first" });
    }

    const totalLessons = course.modules.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0);
    const completedLessons = await Progress.countDocuments({ userId, courseId, completed: true });
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    if (progressPercentage < 100) {
      return res.status(403).json({ message: "Certificate available only after course completion" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `${course.title.replace(/\s+/g, "_")}_certificate.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);

    doc.rect(30, 30, 535, 770).lineWidth(4).stroke("#4f46e5");
    doc.fontSize(28).fillColor("#111827").text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);
    doc.fontSize(14).fillColor("#6b7280").text("This certificate is proudly presented to", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(24).fillColor("#111827").text(user.name, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(14).fillColor("#6b7280").text("for successfully completing", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(22).fillColor("#4f46e5").text(course.title, { align: "center" });
    doc.moveDown(1.5);
    doc.fontSize(12).fillColor("#111827").text(`Instructor: ${(course.instructor as any)?.name || "Instructor"}`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#111827").text(`Completion Date: ${new Date().toLocaleDateString("en-IN")}`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#111827").text(`Final Progress: ${progressPercentage}%`, { align: "center" });

    doc.moveDown(3);
    doc.fontSize(10).fillColor("#6b7280").text("This certificate was generated automatically by CLMS.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
