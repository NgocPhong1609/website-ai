<<<<<<< HEAD
import { DashboardTopbar } from "@/src/features/student/dashboard";
import { Sidebar, FloatingAiChat } from "@/src/features/student/layout";
=======
import { InstructorSidebar } from "@/src/features/instructor/management/components/InstructorSidebar";
import { InstructorTopbar } from "@/src/features/instructor/management/components/InstructorTopbar";
>>>>>>> origin/main
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Khóa học — MindNova AI Instructor",
  description:
    "Bảng điều khiển giảng viên MindNova AI — quản lý khóa học, học viên và doanh thu.",
};

export default function InstructorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F4F8]">
      <InstructorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <InstructorTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <FloatingAiChat />
    </div>
  );
}
