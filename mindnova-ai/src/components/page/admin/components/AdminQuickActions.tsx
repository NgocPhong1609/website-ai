import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminQuickActionsProps {
  quickActions: AdminOverviewData["quickActions"];
}

export function AdminQuickActions({ quickActions }: AdminQuickActionsProps) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 grid gap-3">
        {quickActions.map((action) => (
          <button
            key={action}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}
