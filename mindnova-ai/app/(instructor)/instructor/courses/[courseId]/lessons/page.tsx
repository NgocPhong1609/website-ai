import { LessonManagementContainer } from "@/src/features/instructor/lesson-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Bài học — MindNova AI",
  description:
    "Quản lý nội dung và cấu trúc bài giảng cho khóa học của bạn trên MindNova AI.",
};

// Route: /instructor/courses/[courseId]/lessons
export default async function LessonsPage({ params }: { params: { courseId: string } }) {
  // Wait for params in Next.js App Router (if Next >= 15 it's a promise, we handle it generic enough or assume it's synchronous for now based on the version, wait Next 16 is installed so it's a Promise)
  const { courseId } = await params;
  return <LessonManagementContainer courseId={courseId} />;
}
