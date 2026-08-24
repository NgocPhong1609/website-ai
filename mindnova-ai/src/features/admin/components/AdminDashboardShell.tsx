import type { ReactNode } from "react";

interface AdminDashboardShellProps {
  children: ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#edf7fb_0%,#eaf1f8_100%)] text-slate-900 [--mn-cyan:#0ea5e9] [--mn-indigo:#4f46e5] [--mn-ink:#0b122a] [font-family:var(--font-admin-body)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]" />
      <div className="relative mx-auto max-w-[1600px] px-3 py-3 sm:px-5 lg:px-6">
        {children}
      </div>
    </div>
  );
}
