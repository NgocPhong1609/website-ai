import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import { AdminDashboardShell } from "@/src/features/admin/components/AdminDashboardShell";
import { AdminChrome } from "@/src/features/admin/components/AdminChrome";
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
 <AdminChrome>{children}</AdminChrome>
 </AdminDashboardShell>
 </div>
 );
}
