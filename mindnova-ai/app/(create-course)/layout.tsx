import { CreateCourseTopbar } from "@/src/features/instructor/create-course";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo khóa học — MindNova AI Instructor",
  description:
    "Tạo khóa học mới với MindNova AI — thêm thông tin cơ bản, cấu trúc nội dung và cài đặt.",
};

export default function CreateCourseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#F8F8FD] flex flex-col">
      <CreateCourseTopbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
