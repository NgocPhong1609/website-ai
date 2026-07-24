import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminActivityChartProps {
  activities: AdminOverviewData["activities"];
}

export function AdminActivityChart({ activities }: AdminActivityChartProps) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Biểu đồ hoạt động</h2>
          <p className="text-sm text-slate-500">Tổng quan theo 7 ngày gần nhất</p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          Live data
        </span>
      </div>

      <div className="mt-6 grid grid-cols-7 items-end gap-3">
        {activities.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-violet-600 to-cyan-400"
              style={{ height: `${item.value}px` }}
            />
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
