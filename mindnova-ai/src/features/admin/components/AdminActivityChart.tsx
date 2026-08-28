import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminActivityChartProps {
 activities: AdminOverviewData["activities"];
}

export function AdminActivityChart({ activities }: AdminActivityChartProps) {
 const values = activities.map((item) => item.value);
 const maxValue = Math.max(...values, 100);
 const minValue = Math.min(...values, 0);
 const range = maxValue - minValue || 1;

 const points = activities
 .map((item, index) => {
 const x = (index / Math.max(activities.length - 1, 1)) * 100;
 const y = 100 - ((item.value - minValue) / range) * 80 - 10;
 return `${x},${y}`;
 })
 .join(" ");

 return (
 <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_48px_-30px_rgba(15,23,42,0.5)]">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h2 className="text-xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
 Biểu đồ hoạt động
 </h2>
 <p className="text-sm text-slate-500">Tổng quan theo 7 ngày gần nhất</p>
 </div>
 <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold -[#2C3039] ring-1 ring-emerald-100">
 <span className="h-2 w-2 rounded-full -[#2C3039]" />
 +12.4% so với tuần trước
 </div>
 </div>

 <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
 <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
 <></>
 </div>

 <div className="space-y-3">
 {activities.slice(-3).map((item) => (
 <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
 <div className="flex items-center justify-between text-sm text-slate-500">
 <span>{item.label}</span>
 <span className="font-semibold text-slate-700">{item.value}</span>
 </div>
 <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
 <div
 className="h-full rounded-full from-sky-500 -[#C0392B] -[#C0392B]"
 style={{ width: `${Math.min((item.value / maxValue) * 100, 100)}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>
 </article>
 );
}
