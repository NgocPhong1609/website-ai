"use client";

import { useCourseHealth } from "../api";

export function CourseHealthCard({ courseId }: { courseId: string }) {
  const { data: report, isLoading, isError, refetch } = useCourseHealth(courseId);

  if (isLoading) {
    return <div className="mb-5 h-24 animate-pulse rounded-2xl border border-gray-100 bg-white" />;
  }

  if (isError || !report) {
    return (
      <section className="mb-5 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <span>Không thể kiểm tra mức sẵn sàng của khóa học.</span>
        <button type="button" onClick={() => refetch()} className="font-bold underline">Thử lại</button>
      </section>
    );
  }

  const hasErrors = !report.can_submit;
  const tone = hasErrors ? "rose" : report.status === "ready" ? "emerald" : "amber";
  const title = hasErrors ? "Cần hoàn thiện trước khi gửi duyệt" : report.status === "ready" ? "Khóa học sẵn sàng gửi duyệt" : "Khóa học sẵn sàng, nhưng còn lưu ý";

  return (
    <section className={`mb-5 rounded-2xl border p-4 ${tone === "rose" ? "border-rose-200 bg-rose-50" : tone === "emerald" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-gray-900">Course Health · {report.score}/100</p>
          <p className="mt-0.5 text-xs font-medium text-gray-700">{title}</p>
        </div>
        <button type="button" onClick={() => refetch()} className="rounded-lg border border-current/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white">
          Kiểm tra lại
        </button>
      </div>

      {report.issues.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs text-gray-800" aria-live="polite">
          {report.issues.slice(0, 4).map((issue) => (
            <li key={`${issue.severity}-${issue.field}-${issue.message}`} className="flex gap-2">
              <span aria-hidden="true">{issue.severity === "error" ? "✕" : "!"}</span>
              <span>{issue.message}</span>
            </li>
          ))}
          {report.issues.length > 4 && <li className="font-semibold">+{report.issues.length - 4} mục khác cần xem lại</li>}
        </ul>
      )}
    </section>
  );
}
