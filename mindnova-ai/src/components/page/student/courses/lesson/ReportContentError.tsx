"use client";

import { useReportContentError, ContentErrorType } from "@/src/hooks/useReportContentError";

interface ReportContentErrorProps {
  courseId?: number;
  lessonId?: number;
}

const ERROR_TYPES: ContentErrorType[] = [
  "Audio/Video Glitch",
  "Typo in Transcript",
  "Broken Code Example",
  "Inaccurate Concept",
  "Other",
];

export function ReportContentError({ courseId = 1, lessonId = 101 }: ReportContentErrorProps) {
  const {
    errorType,
    description,
    context,
    isSubmitting,
    isSubmitted,
    setErrorType,
    setDescription,
    handleSubmitReport,
    resetForm,
  } = useReportContentError({ courseId, lessonId });

  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm text-[#111827]">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-5">
        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">Report Content Issue</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Help maintain rigorous course quality by notifying the instructor of discrepancies.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-800">Report Successfully Transmitted</h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-md leading-relaxed">
              Your report has been securely sent to the instructor alongside complete system diagnostic variables (user ID, browser parameters, lesson timestamp, and active URI).
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="mt-2 px-4 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            Submit Another Issue
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600 shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">Auto-captured system context:</span>
              <div className="mt-1 font-mono text-[11px] text-indigo-700 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                <span>• User: {context.userId}</span>
                <span>• Course: #{context.courseId} / Lesson: #{context.lessonId}</span>
                <span className="truncate" title={context.userAgent}>• Env: {context.userAgent.substring(0, 35)}...</span>
                <span>• Time: {new Date(context.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="error-type" className="text-xs font-semibold text-gray-700">
              Select Discrepancy Type
            </label>
            <select
              id="error-type"
              value={errorType}
              onChange={(e) => setErrorType(e.target.value as ContentErrorType)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-[#4F46E5] transition-colors"
            >
              {ERROR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="error-desc" className="text-xs font-semibold text-gray-700">
              Additional Observations (Optional)
            </label>
            <textarea
              id="error-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe what happened or what looks incorrect..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-gray-800 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] resize-none transition-colors"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Transmitting Diagnostics..." : "Submit Error Report"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
