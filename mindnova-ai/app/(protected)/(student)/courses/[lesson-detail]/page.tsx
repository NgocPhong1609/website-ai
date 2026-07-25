import type { Metadata } from "next";
import {
  LessonCurriculumSidebar,
  LessonView,
} from "@/src/components/page/student/courses";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lesson | MindNova AI",
  description: "Learn and interact with MindNova AI lesson content.",
};

interface LessonPageProps {
  params: Promise<{ "lesson-detail": string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { "lesson-detail": lessonId } = await params;

  // ── Access Control (Server-side) ──────────────────────────────────────────
  // Core Rule: Users can ONLY access lesson content if their User_Course
  // status is ACTIVE. This check happens server-side (no client bypass possible).
  //
  // In production: const access = await apiClient<{status: string}>(`/api/courses/${COURSE_DETAIL.id}/access`)
  const userCourseStatus = COURSE_DETAIL.userCourseStatus;

  if (!userCourseStatus || userCourseStatus !== "ACTIVE") {
    redirect("/billing/checkout");
  }

  return (
    <div className="flex h-full w-full bg-white relative">
      {/* Left: Curriculum Navigation Sidebar */}
      <LessonCurriculumSidebar />

      {/* Right: Lesson Content + Footer (client-side, owns heartbeat state) */}
      <LessonView lessonId={lessonId} />
    </div>
  );
}
