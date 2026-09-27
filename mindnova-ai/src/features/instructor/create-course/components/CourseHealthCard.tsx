"use client";

import { useCourseHealth } from "../api";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

export function CourseHealthCard({ courseId }: { courseId: string }) {
 const { data: report, isLoading, isError, refetch } = useCourseHealth(courseId);

 if (isLoading) {
 return (
 <div role="status" aria-busy="true" aria-label="Đang kiểm tra mức sẵn sàng" className="mb-5 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
 <Skeleton className="h-4 w-48" />
 <Skeleton className="h-3 w-full" />
 <Skeleton className="h-3 w-2/3" />
 </div>
 );
 }

 if (isError || !report) {
 return (
 <section className="mb-5 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
 <span>Không thể kiểm tra mức sẵn sàng của khóa học.</span>
 <button type="button" onClick={() => refetch()} className="font-bold underline">Thử lại</button>
 </section>
 );
 }

 const hasErrors = !report.can_submit;
 const tone = hasErrors ? "rose" : report.status === "ready" ? "emerald" : "amber";
 const title = hasErrors ? "Cần hoàn thiện trước khi gửi duyệt" : report.status === "ready" ? "Khóa học sẵn sàng gửi duyệt" : "Khóa học sẵn sàng, nhưng còn lưu ý";

 return (
 <section className={`mb-5 rounded-lg border p-4 ${tone === "rose" ? "border-rose-200 bg-rose-50" : tone === "emerald" ? "text-emerald-700 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <p className="text-sm font-bold text-slate-900">Course Health · {report.score}/100</p>
 <p className="mt-0.5 text-xs font-medium text-slate-700">{title}</p>
 </div>
 <button type="button" onClick={() => refetch()} className="rounded-lg border border-current/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white">
 Kiểm tra lại
 </button>
 </div>

 {report.issues.length > 0 && (
 <ul className="mt-3 space-y-1.5 text-xs text-slate-800" aria-live="polite">
 {report.issues.slice(0, 4).map((issue) => (
 <li key={`${issue.severity}-${issue.field}-${issue.message}`} className="flex gap-2">
 <span className={`shrink-0 font-black ${issue.severity === "error" ? "text-rose-700" : "text-amber-700"}`}>
  {issue.severity === "error" ? "Bắt buộc" : "Khuyến nghị"}
 </span>
 <span>{issue.message}</span>
 </li>
 ))}
 {report.issues.length > 4 && <li className="font-semibold">+{report.issues.length - 4} mục khác cần xem lại</li>}
 </ul>
 )}
 </section>
 );
}
