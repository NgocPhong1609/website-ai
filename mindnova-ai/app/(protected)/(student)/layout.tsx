import type { Metadata } from "next";
<<<<<<< HEAD
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/layout.tsx
import { Sidebar } from "./layout/components/Sidebar";
import { DashboardTopbar } from "@/src/components/page/student/dashboard";
=======
import { Sidebar } from "@/src/features/student/layout";
import { DashboardTopbar } from "@/src/features/student/dashboard";
>>>>>>> cb5bd5256681bc413148896ee90827b7f054ec2e:mindnova-ai/app/(dashboard)/layout.tsx
=======
import { Sidebar } from "./layout/components/Sidebar";
import { DashboardTopbar } from "@/src/components/page/student/dashboard";
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede

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
