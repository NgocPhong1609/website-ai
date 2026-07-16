import { StudentManagementContainer } from "@/src/features/instructor/student-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Học viên — MindNova AI",
  description:
    "Theo dõi, hỗ trợ và tương tác với cộng đồng học viên MindNova AI.",
};

export default function StudentsPage() {
  return <StudentManagementContainer />;
}
