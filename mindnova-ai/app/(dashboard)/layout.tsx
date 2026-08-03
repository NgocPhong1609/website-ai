import type { Metadata } from "next";
import { Sidebar, FloatingAiChat } from "@/src/features/student/layout";
import { DashboardTopbar } from "@/src/features/student/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your MindNova AI learning dashboard — track progress, continue courses, and get AI-powered study suggestions.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden flex bg-[#F7F7FB]">
        {/* Left sidebar — sticky */}
        <Sidebar />

        {/* Right: topbar + scrollable content */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        </div>
      </div>

      {/* Global Student Floating AI Co-Pilot Icon & Modal - Absolute top level in DOM to prevent z-index or overflow clipping */}
      <FloatingAiChat />
    </>
  );
}
