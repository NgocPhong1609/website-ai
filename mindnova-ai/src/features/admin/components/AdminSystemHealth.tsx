import type { AdminOverviewData } from "@/src/features/admin/types";

interface AdminSystemHealthProps {
 health: AdminOverviewData["health"];
}

export function AdminSystemHealth({ health }: AdminSystemHealthProps) {
 const toTitleLabel = (title: string) => {
 const value = title.toLowerCase();
 if (value.includes("queue")) return "Hàng đợi tác vụ";
 if (value.includes("storage")) return "Lưu trữ";
 if (value.includes("ai service")) return "Dịch vụ AI";
 return title;
 };

 const toStatusLabel = (status: string) => {
 const value = status.toLowerCase();
 if (value.includes("healthy") || value.includes("stable")) return "Ổn định";
 if (value.includes("warning")) return "Cảnh báo";
 return status;
 };

 return (
 <article className="mn-stagger rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Sức khỏe hệ thống</h2>
 <div className="mt-4 space-y-3">
 {health.map((item) => (
 <div
 key={item.title}
 className="flex items-center justify-between rounded-xl border border-slate-100 from-slate-50 to-white px-3 py-3"
 >
 <div className="flex items-center gap-3">
 <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
 <span className="text-sm font-medium text-slate-700">{toTitleLabel(item.title)}</span>
 </div>
 <span className="text-xs font-semibold text-slate-600">{toStatusLabel(item.status)}</span>
 </div>
 ))}
 </div>
 </article>
 );
}
