import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminQuickActionsProps {
  quickActions: AdminOverviewData["quickActions"];
}

export function AdminQuickActions({ quickActions }: AdminQuickActionsProps) {
  return (
    <article className="mn-stagger rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
      <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Tác vụ nhanh</h2>
      <div className="mt-4 grid gap-3">
        {quickActions.map((action) => (
          <button
            key={action}
            className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50/80 hover:text-cyan-800"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}
