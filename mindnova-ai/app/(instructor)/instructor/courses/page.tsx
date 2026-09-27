import { CourseManagementContainer } from "@/src/features/instructor/management";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Quản lý Khóa học",
 description: "Quản lý toàn bộ khóa học của bạn trên MindNova AI.",
};

export default function CoursesPage() {
 return <CourseManagementContainer />;
}
