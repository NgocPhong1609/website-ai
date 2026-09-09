import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminActivityChartProps {
 activities: AdminOverviewData["activities"];
}

export function AdminActivityChart({ activities }: AdminActivityChartProps) {
 const values = activities.map((item) => item.value);
 const maxValue = Math.max(...values, 1);

 return (
 <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_48px_-30px_rgba(15,23,42,0.5)]">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
 Người dùng đăng ký mới
 </h2>
 <p className="text-sm text-slate-500">Số lượt đăng ký theo ngày trong 7 ngày gần nhất.</p>
 </div>
 </div>

 {activities.length === 0 ? <p className="mt-6 text-sm text-slate-600">Chưa có dữ liệu hoạt động.</p> :
 <div role="img" aria-label={`Người dùng đăng ký mới: ${activities.map((item) => `${item.label}: ${item.value}`).join(", ")}`} className="mt-6 flex h-48 items-end gap-2 sm:gap-4">
 {activities.map((item, index) => <div key={`${item.label}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center gap-2">
 <span className="text-xs font-medium text-slate-700">{item.value}</span>
 <div className="flex w-full flex-1 items-end rounded-lg bg-slate-50">
 <div className="w-full rounded-t-lg bg-sky-600" style={{ height: `${(item.value / maxValue) * 100}%` }} />
 </div>
 <span className="max-w-full truncate text-xs text-slate-600">{item.label}</span>
 </div>)}
 </div>}
 </article>
 );
}
