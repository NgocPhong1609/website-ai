import type { Metadata } from "next";
import { AdminDashboardShell } from "@/src/features/admin/components/AdminDashboardShell";
import { AdminSidebar } from "@/src/features/admin/components/AdminSidebar";
import { AdminTopbar } from "@/src/features/admin/components/AdminTopbar";
import { AdminAuthGuard } from "@/src/features/admin/components/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "MindNova AI admin overview and management console.",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminAuthGuard />
      <AdminDashboardShell>
        <div className="flex h-[calc(100vh-1rem)] overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <AdminSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </AdminDashboardShell>
    </>
  );
}
