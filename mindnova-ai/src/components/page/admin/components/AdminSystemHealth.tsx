import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminSystemHealthProps {
  health: AdminOverviewData["health"];
}

export function AdminSystemHealth({ health }: AdminSystemHealthProps) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">System Health</h2>
      <div className="mt-4 space-y-3">
        {health.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-slate-700">{item.title}</span>
            </div>
            <span className="text-xs font-semibold text-slate-600">{item.status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
