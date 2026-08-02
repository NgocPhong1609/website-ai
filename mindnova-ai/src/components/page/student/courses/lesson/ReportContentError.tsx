"use client";

import { useReportContentError, ContentErrorType } from "@/src/hooks/useReportContentError";

interface ReportContentErrorProps {
  courseId?: number;
  lessonId?: number;
}

const ERROR_TYPES: { value: ContentErrorType; label: string }[] = [
  { value: "Audio/Video Glitch",  label: "Lỗi âm thanh / hình ảnh" },
  { value: "Typo in Transcript",  label: "Lỗi chính tả trong phụ đề" },
  { value: "Broken Code Example", label: "Đoạn code bị lỗi / không chạy được" },
  { value: "Inaccurate Concept",  label: "Khái niệm không chính xác" },
  { value: "Other",               label: "Vấn đề khác" },
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
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-2xs text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-base">
          ⚑
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-tight">Báo Cáo Lỗi Nội Dung Bài Giảng</h3>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Giúp nâng cao chất lượng khóa học bằng cách thông báo cho giảng viên về các sai sót.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-800">Báo cáo đã gửi thành công!</h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-md leading-relaxed font-semibold">
              Báo cáo của bạn đã được gửi bảo mật đến giảng viên kèm theo toàn bộ thông tin chẩn đoán hệ thống (mã người dùng, khóa học, mốc thời gian và môi trường trình duyệt).
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="mt-1 px-5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Gửi báo cáo khác
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Auto-captured context */}
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
            <span className="text-[#4F46E5] shrink-0 mt-0.5 text-base">ℹ️</span>
            <div className="text-xs text-gray-700 leading-relaxed">
              <span className="font-black text-gray-900">Thông tin hệ thống tự động ghi nhận:</span>
              <div className="mt-1.5 font-mono text-[11px] text-[#4F46E5] grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                <span>• Người dùng: {context.userId}</span>
                <span>• Khóa học: #{context.courseId} / Bài: #{context.lessonId}</span>
                <span className="truncate" title={context.userAgent}>• Môi trường: {context.userAgent.substring(0, 30)}...</span>
                <span>• Thời gian: {new Date(context.timestamp).toLocaleTimeString("vi-VN")}</span>
              </div>
            </div>
          </div>

          {/* Error type select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="error-type" className="text-xs font-black text-gray-700 uppercase tracking-wider">
              Phân loại lỗi
            </label>
            <select
              id="error-type"
              value={errorType}
              onChange={(e) => setErrorType(e.target.value as ContentErrorType)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-colors cursor-pointer"
            >
              {ERROR_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Description textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="error-desc" className="text-xs font-black text-gray-700 uppercase tracking-wider">
              Mô tả thêm (không bắt buộc)
            </label>
            <textarea
              id="error-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Mô tả những gì đã xảy ra hoặc nội dung nào không chính xác..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-900 bg-gray-50 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 resize-none transition-colors"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? "⌛ Đang gửi chẩn đoán..." : "⚑ Gửi báo cáo lỗi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
