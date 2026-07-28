import { CourseManagementContainer } from "@/src/features/instructor/management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses — MindNova AI",
  description: "Quản lý toàn bộ khóa học của bạn trên MindNova AI.",
};

export default function CoursesPage() {
  return <CourseManagementContainer />;
}
