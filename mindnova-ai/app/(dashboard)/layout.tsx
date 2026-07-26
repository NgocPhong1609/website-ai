import type { Metadata } from "next";
import { Sidebar } from "@/src/features/student/layout";
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
    <div className="flex h-screen overflow-hidden bg-[#F7F7FB]">
      {/* Left sidebar — sticky */}
      <Sidebar />

      {/* Right: topbar + scrollable content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
