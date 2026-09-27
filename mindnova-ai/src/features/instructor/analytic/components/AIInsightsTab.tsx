"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAiInsights } from "../hooks/useAiInsights";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

export function AIInsightsTab() {
 const { insights: initialInsights, isLoading, error, refetch } = useAiInsights();
 const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
 const [filter, setFilter] = useState<"all" | "high" | "unresolved">("unresolved");

 const resolveItem = (id: string) => {
 setResolvedIds((prev) => {
 const next = new Set(prev);
 next.add(id);
 return next;
 });
 };

 const insights = initialInsights.map((i) => ({
 ...i,
 isResolved: resolvedIds.has(i.id),
 }));

 const filtered = insights.filter((i) => {
 if (filter === "unresolved") return !i.isResolved;
 if (filter === "high") return i.priority === "high";
 return true;
 });

 if (isLoading) {
 return (
 <div role="status" aria-busy="true" aria-label="Đang phân tích dữ liệu học viên" className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
 <div className="flex gap-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-16" /></div>
 <Skeleton className="h-5 w-3/4" />
 <Skeleton className="h-3 w-full" />
 <Skeleton className="h-3 w-5/6" />
 <Skeleton className="h-16 w-full rounded-lg" />
 </div>
 ))}
 </div>
 );
 }

 if (error) {
 return (
 <div className="p-8 text-center rounded-lg bg-blue-50 border border-blue-100">
 <p className="text-sm font-bold text-blue-600 mb-4">{error}</p>
 <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md">Thử lại</button>
 </div>
 );
 }

 return (
 <div className="w-full flex flex-col gap-5 animate-fadeIn">
 {/* Header Summary Box */}
 <div className="p-6 rounded-lg bg-blue-500 text-white border-blue-500 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 
 <div>
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="text-base font-bold text-white">Đề Xuất Cải Tiến Nội Dung AI Chuyên Sâu</h3>
 <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900/30 text-white border-slate-200/40">
 Live Behavioral Telemetry
 </span>
 </div>
 <p className="text-xs text-slate-50 max-w-xl mt-1">
 Hệ thống trí tuệ nhân tạo liên tục giám sát tỷ lệ rời bài, tần suất tua lại và kết quả kiểm tra để phát hiện và cảnh báo điểm nghẽn cổ chai của học viên.
 </p>
 </div>
 </div>

 {/* Filter Pills */}
 <div className="flex items-center gap-1 p-1 rounded-lg bg-white/10 border border-white/10 text-xs font-bold shrink-0">
 <button
 type="button"
 onClick={() => setFilter("unresolved")}
 className={twMerge(
 "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
 filter === "unresolved" ? "bg-white text-blue-500 shadow-sm font-semibold" : "text-white/80 hover:bg-white/10"
 )}
 >
 Cần Xử Lý ({insights.filter((i) => !i.isResolved).length})
 </button>
 <button
 type="button"
 onClick={() => setFilter("high")}
 className={twMerge(
 "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
 filter === "high" ? "bg-rose-500 text-white font-semibold shadow-sm" : "text-white/80 hover:bg-white/10"
 )}
 >
 Ưu Tiên Cao ({insights.filter((i) => i.priority === "high").length})
 </button>
 <button
 type="button"
 onClick={() => setFilter("all")}
 className={twMerge(
 "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
 filter === "all" ? "bg-white text-blue-500 shadow-sm font-semibold" : "text-white/80 hover:bg-white/10"
 )}
 >
 Tất cả ({insights.length})
 </button>
 </div>
 </div>

 {/* Insights List Grid */}
 {filtered.length === 0 ? (
 <div className="p-14 text-center rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col items-center gap-2 text-slate-500">
 <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden />
 <p className="text-sm font-bold text-slate-900">Tất cả các điểm nghẽn bài học đều đã được giải quyết!</p>
 <p className="text-xs max-w-md">Các chỉ số tương tác bài giảng của bạn đang ở tình trạng tối ưu hóa xuất sắc.</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {filtered.map((item) => (
 <div
 key={item.id}
 className={twMerge(
 "p-5 rounded-lg bg-white border transition-all duration-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5",
 item.priority === "high" && !item.isResolved
 ? "border-rose-200 bg-rose-50/10"
 : "border-slate-200",
 item.isResolved && "opacity-60 bg-slate-50/50 border-slate-200"
 )}
 >
 <div className="flex flex-col gap-2.5 flex-1">
 {/* Title & Badge */}
 <div className="flex flex-wrap items-center gap-2">
 <span
 className={twMerge(
 "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
 item.type === "warning" && "bg-amber-50 text-amber-800 border-amber-200",
 item.type === "suggestion" && "bg-emerald-50 text-emerald-700",
 item.type === "trend" && "bg-sky-50 text-blue-500"
 )}
 >
 {item.type.toUpperCase()}
 </span>

 <span className="text-sm font-semibold text-slate-900">{item.title}</span>
 </div>

 {/* Telemetry metric explanation */}
 <p className="text-xs font-bold text-slate-500 pl-1">
 <span className="text-slate-900 font-medium">{item.description}</span>
 </p>
 {item.metrics && Object.keys(item.metrics).length > 0 && (
 <div className="flex items-center gap-3 pl-1 mt-1">
 {Object.entries(item.metrics).map(([k, v]) => (
 <div key={k} className="text-xs bg-slate-100 rounded px-2 py-1 border border-slate-200 text-slate-700">
 <span className="font-semibold">{k}:</span> {v}
 </div>
 ))}
 </div>
 )}

 {/* AI Rationale & Remediation Suggestion */}
 <div className="p-3.5 mt-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs font-medium text-blue-950 leading-relaxed flex flex-col gap-1.5">
 <div className="flex items-center gap-2">
 <Lightbulb className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
 <strong className="font-semibold text-blue-700">Đề xuất Kế hoạch hành động: </strong>
 </div>
 <ul className="list-disc list-inside text-xs pl-6 flex flex-col gap-1">
 {item.actionPlan?.map((plan, idx) => (
 <li key={idx}>{plan}</li>
 ))}
 </ul>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex sm:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
 <button
 type="button"
 onClick={() => alert(`Đang điều hướng...`)}
 className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
 >
 Tối Ưu Hóa Ngay 
 </button>
 {!item.isResolved && (
 <button
 type="button"
 onClick={() => resolveItem(item.id)}
 className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:bg-slate-900 font-bold text-xs transition-all border border-slate-200 hover:bg-slate-50 cursor-pointer"
 >
 Đánh Dấu Đã Cải Tiến
 </button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}