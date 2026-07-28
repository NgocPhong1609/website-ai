import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminActivityChartProps {
  activities: AdminOverviewData["activities"];
}

export function AdminActivityChart({ activities }: AdminActivityChartProps) {
  return (
    <article className="mn-stagger rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Biểu đồ hoạt động</h2>
          <p className="text-sm text-slate-500">Tổng quan theo 7 ngày gần nhất</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
          Dữ liệu trực tiếp
        </span>
      </div>

      <div className="mt-6 grid grid-cols-7 items-end gap-3">
        {activities.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-500 via-sky-500 to-cyan-300 shadow-[0_14px_28px_-18px_rgba(59,130,246,0.9)]"
              style={{ height: `${item.value}px` }}
            />
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
