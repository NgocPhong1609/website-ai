import type { Metadata } from "next";
import { CoursePlayerContainer } from "@/src/components/page/student/courses";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Phòng Học Trực Tuyến & Gia Sư AI | MindNova AI",
  description: "Theo dõi bài giảng video tương tác, đặt câu hỏi cùng Trợ lý AI RAG và nhận chứng chỉ tốt nghiệp được bảo đảm bởi Blockchain MindNova.",
};

interface LessonPageProps {
  params: Promise<{ "lesson-detail": string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { "lesson-detail": lessonId } = await params;

  // ── Access Control (Server-side) ────────────────────────────────────────────
  const userCourseStatus = COURSE_DETAIL.userCourseStatus;

  if (!userCourseStatus || userCourseStatus !== "ACTIVE") {
    redirect("/billing/checkout");
  }

  return <CoursePlayerContainer lessonId={lessonId} />;
}
