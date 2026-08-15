import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { AdminDashboardShell } from "@/src/features/admin/components/AdminDashboardShell";
import { AdminSidebar } from "@/src/features/admin/components/AdminSidebar";
import { AdminTopbar } from "@/src/features/admin/components/AdminTopbar";
import { AdminAuthGuard } from "@/src/features/admin/components/AdminAuthGuard";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-admin-head",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-admin-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bảng điều khiển quản trị",
  description: "Trang quản trị MindNova AI để theo dõi và vận hành hệ thống.",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${sora.variable} ${spaceGrotesk.variable}`}>
      <AdminAuthGuard />
      <AdminDashboardShell>
        <div className="flex h-[calc(100vh-1.5rem)] overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/75 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl">
          <AdminSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(241,245,249,0.5))]">
              {children}
            </main>
          </div>
        </div>
      </AdminDashboardShell>
    </div>
  );
}
