import { LessonManagementContainer } from "@/src/components/page/instructor/lesson-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Bài học — MindNova AI",
  description:
    "Quản lý nội dung và cấu trúc bài giảng cho khóa học của bạn trên MindNova AI.",
};

// Route: /instructor/courses/[courseId]/lessons
export default function LessonsPage() {
  return <LessonManagementContainer />;
}
