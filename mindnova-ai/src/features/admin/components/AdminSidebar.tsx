"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
<<<<<<< HEAD
  { label: "Tổng quan", href: "/admin", icon: "⌂" },
  { label: "Người dùng", href: "/admin/users", icon: "◌" },
  { label: "Duyệt giáo viên", href: "/admin/teacher-approvals", icon: "✦" },
  { label: "AI & System", href: "/admin/ai-system", icon: "◫" },
  { label: "Nội dung", href: "/admin/content", icon: "◈" },
  { label: "Mã giảm giá", href: "/admin/coupons", icon: "◌" },
  { label: "Doanh thu", href: "/admin/revenue", icon: "◍" },
  { label: "Báo cáo", href: "/admin/analytics", icon: "▣" },
  { label: "Kiểm duyệt", href: "/admin/moderation-support", icon: "⚑" },
=======
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Người dùng", href: "/admin/users", icon: "◎" },
  { label: "AI & Hệ thống", href: "/admin/ai-system", icon: "◌" },
  { label: "Quản lý khóa học", href: "/admin/content", icon: "▣" },
  { label: "Thống kê", href: "/admin/analytics", icon: "◍" },
  { label: "Moderation & Support", href: "/admin/moderation-support", icon: "✉" },
>>>>>>> origin/main
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,#0f172a_0%,#101f36_38%,#16284b_100%)] text-slate-100">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500 text-sm font-black tracking-[0.18em] text-slate-900 shadow-[0_18px_35px_-18px_rgba(59,130,246,0.9)]">
            MN
          </div>
          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-200/70">
              MindNova
            </p>
            <h2 className="mt-1 text-[22px] font-semibold text-white [font-family:var(--font-admin-head)]">
              Admin
            </h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-[15px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(14,165,233,0.28),rgba(96,165,250,0.16))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_30px_-20px_rgba(56,189,248,0.8)] ring-1 ring-white/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-[13px] font-bold ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_8px_18px_-10px_rgba(56,189,248,0.9)]"
                    : "bg-slate-700/70 text-slate-200 group-hover:bg-slate-600/80"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(59,130,246,0.08),rgba(15,23,42,0.28))] p-4 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-cyan-100/75">
            <span>System</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-1 text-[9px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <p className="mt-3 text-[15px] font-semibold text-white">Tất cả dịch vụ đang ổn định</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">Dữ liệu theo thời gian thực đã được đồng bộ.</p>
        </div>
      </div>
    </aside>
  );
}
