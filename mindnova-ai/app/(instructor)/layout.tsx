import { DashboardTopbar } from "@/src/features/student/dashboard";
import { InstructorSidebar } from "@/src/features/instructor/management/components/InstructorSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "dashboard",
  description:
    "Your MindNova AI learning dashboard — track progress, continue courses, and get AI-powered study suggestions.",
};

export default function InstructorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <InstructorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
