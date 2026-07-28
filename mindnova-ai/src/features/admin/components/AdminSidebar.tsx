"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Tổng quan", href: "/admin", icon: "◈" },
  { label: "Danh mục", href: "/admin/categories", icon: "◍" },
  { label: "Khóa học", href: "/admin/courses", icon: "▣" },
  { label: "Kiểm duyệt", href: "/admin/users", icon: "◎" },
  { label: "Hóa đơn", href: "/admin/invoices", icon: "◌" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[284px] shrink-0 flex-col border-r border-cyan-100/40 bg-[linear-gradient(180deg,#060c23_0%,#0a1535_52%,#08112b_100%)] text-slate-100">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500 text-lg font-bold text-[#061233] shadow-[0_10px_26px_-12px_rgba(56,189,248,0.9)]">
            MN
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.36em] text-cyan-100/70">
              MindNova
            </p>
            <h2 className="text-[28px] font-semibold leading-7 text-white [font-family:var(--font-admin-head)]">Quản trị</h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-400/28 via-white/10 to-transparent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_28px_-18px_rgba(14,165,233,0.75)]"
                  : "text-slate-200/85 hover:bg-white/6 hover:text-cyan-100"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${
                  isActive ? "bg-cyan-300/20 text-cyan-100" : "bg-white/5 text-slate-200 group-hover:bg-cyan-300/15"
                }`}
              >
                {item.icon}
              </span>
              <span className="tracking-[0.01em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400/12 via-white/5 to-indigo-400/12 p-4 ring-1 ring-cyan-100/20">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/70">
            Hệ thống
          </p>
          <p className="mt-2 text-sm font-medium text-white">Mọi dịch vụ hoạt động tốt</p>
          <p className="mt-1 text-xs text-slate-300/90">Dữ liệu giám sát thời gian thực ổn định</p>
        </div>
      </div>
    </aside>
  );
}
