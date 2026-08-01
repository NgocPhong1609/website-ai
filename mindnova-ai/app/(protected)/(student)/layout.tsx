import type { Metadata } from "next";
import { Sidebar } from "./layout/components/Sidebar";
import { DashboardTopbar } from "@/src/components/page/student/dashboard";
import { SidebarProvider } from "@/src/components/ui";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your MindNova AI learning dashboard — track progress, continue courses, and get AI-powered study suggestions.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#F4F4F8]">
        {/* Left sidebar — sticky */}
        <Sidebar />

        {/* Right: topbar + scrollable content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}