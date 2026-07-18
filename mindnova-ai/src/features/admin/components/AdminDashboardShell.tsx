import type { ReactNode } from "react";

interface AdminDashboardShellProps {
  children: ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.14),_transparent_30%),#F7F7FB] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.35),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_65%)]" />
      <div className="relative mx-auto max-w-[1500px] px-2 py-2 sm:px-4 lg:px-6">
        {children}
      </div>
    </div>
  );
}
