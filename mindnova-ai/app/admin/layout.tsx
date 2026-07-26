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
        <div className="mn-reveal flex h-[calc(100vh-1rem)] overflow-hidden rounded-[30px] border border-cyan-100/60 bg-white/70 shadow-[0_30px_90px_-35px_rgba(12,19,43,0.45)] backdrop-blur-2xl">
          <AdminSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </AdminDashboardShell>
    </div>
  );
}
