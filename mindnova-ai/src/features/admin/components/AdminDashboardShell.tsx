import type { ReactNode } from "react";

interface AdminDashboardShellProps {
  children: ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f8ff] text-slate-900 [--mn-cyan:#0ea5e9] [--mn-indigo:#4f46e5] [--mn-ink:#0b122a] [font-family:var(--font-admin-body)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-10%,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_95%_2%,rgba(79,70,229,0.24),transparent_30%),radial-gradient(circle_at_56%_108%,rgba(45,212,191,0.16),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.045)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.45),transparent_48%)]" />
      <div className="relative mx-auto max-w-[1500px] px-2 py-2 sm:px-4 lg:px-6">
        {children}
      </div>
    </div>
  );
}
