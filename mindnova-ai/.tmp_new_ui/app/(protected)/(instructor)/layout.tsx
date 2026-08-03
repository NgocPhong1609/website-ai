import { InstructorSidebar, InstructorTopbar } from "@/src/components/page/instructor/management";
import { SidebarProvider } from "@/src/components/ui";
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
    <SidebarProvider>
      <div className="flex min-h-screen overflow-hidden bg-[#F4F4F8]">
        <InstructorSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <InstructorTopbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}