"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin", icon: "◈" },
  { label: "Users", href: "/admin/users", icon: "◎" },
  { label: "Courses", href: "/admin/courses", icon: "▣" },
  { label: "Reports", href: "/admin/reports", icon: "△" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200/70 bg-slate-950 text-slate-100">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            MN
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              MindNova
            </p>
            <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-gradient-to-r from-white/15 to-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${
                  isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-white/5 text-slate-300"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            System
          </p>
          <p className="mt-2 text-sm font-medium text-white">All services healthy</p>
          <p className="mt-1 text-xs text-slate-400">Last sync 2 mins ago</p>
        </div>
      </div>
    </aside>
  );
}
