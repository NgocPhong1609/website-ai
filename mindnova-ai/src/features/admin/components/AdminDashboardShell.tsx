import type { ReactNode } from "react";

interface AdminDashboardShellProps {
  children: ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 [font-family:var(--font-sans)]">
      <div className="relative mx-auto max-w-[1600px] px-3 py-3 sm:px-5 lg:px-6">{children}</div>
    </div>
  );
}