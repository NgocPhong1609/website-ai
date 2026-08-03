"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export interface AIInsightItem {
  id: string;
  lessonTitle: string;
  timestamp: string;
  issueType: "drop_off" | "rewind_spike" | "quiz_failure";
  metricDetail: string;
  aiSuggestion: string;
  priority: "high" | "medium" | "low";
  isResolved: boolean;
}

const INITIAL_INSIGHTS: AIInsightItem[] = [
  {
    id: "ins-1",
    lessonTitle: "Lesson 2.1: Building Type-Safe Server Actions",
    timestamp: "04:12",
    issueType: "rewind_spike",
    metricDetail: "42% học viên tua lại tại mốc 4:12 (+340% so với mức thông thường).",
    aiSuggestion: "Học viên đang gặp trở ngại khi xử lý dữ liệu phức tạp JavaScript Dates qua ranh giới RSC. Đề xuất bổ sung sơ đồ kiến trúc trực quan hoặc bài đọc AI giải thích sâu ở đoạn này.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-2",
    lessonTitle: "Lesson 3.2: Production Challenge (Drizzle ORM)",
    timestamp: "12:05",
    issueType: "quiz_failure",
    metricDetail: "68% tỷ lệ chọn sai tại Câu hỏi số #3 (Cú pháp Connection Pooling).",
    aiSuggestion: "Cách đặt câu hỏi ở phương án gây nhiễu số 2 chưa rõ ràng về nghĩa. Sử dụng công cụ AI Rapid-Review để tối ưu hóa và tạo lại thang điểm chính xác hơn.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-3",
    lessonTitle: "Lesson 1.2: Configuring App Router Routing",
    timestamp: "18:40",
    issueType: "drop_off",
    metricDetail: "22% học viên dừng phát video ở đoạn giải thích dòng lệnh CLI kéo dài.",
    aiSuggestion: "Chia chuỗi video dài này thành 2 video ngắn 5 phút hoặc chuyển thành bài giảng dạng Tài liệu văn bản tương tác có thể sao chép code.",
    priority: "medium",
    isResolved: false,
  },
];

export function AIInsightsTab() {
  const [insights, setInsights] = useState<AIInsightItem[]>(INITIAL_INSIGHTS);
  const [filter, setFilter] = useState<"all" | "high" | "unresolved">("unresolved");

  const resolveItem = (id: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isResolved: true } : item))
    );
  };

  const filtered = insights.filter((i) => {
    if (filter === "unresolved") return !i.isResolved;
    if (filter === "high") return i.priority === "high";
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn">
      {/* Header Summary Box */}
      <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-black border border-white/20 shrink-0">
            🧠
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-white">Đề Xuất Cải Tiến Nội Dung AI Chuyên Sâu</h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-white border border-emerald-300/40">
                Live Behavioral Telemetry
              </span>
            </div>
            <p className="text-xs text-indigo-100 max-w-xl mt-1">
              Hệ thống trí tuệ nhân tạo liên tục giám sát tỷ lệ rời bài, tầng suất tua lại và kết quả kiểm tra để phát hiện và cảnh báo điểm nghẽn cổ chai của học viên.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setFilter("unresolved")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "unresolved" ? "bg-white text-indigo-900 shadow-2xs font-extrabold" : "text-white/80 hover:bg-white/10"
            )}
          >
            Cần Xử Lý ({insights.filter((i) => !i.isResolved).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("high")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "high" ? "bg-rose-500 text-white font-extrabold shadow-2xs" : "text-white/80 hover:bg-white/10"
            )}
          >
            Ưu Tiên Cao ({insights.filter((i) => i.priority === "high").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={twMerge(
              "px-3.5 py-1.5 rounded-lg transition-all cursor-pointer",
              filter === "all" ? "bg-white text-indigo-900 shadow-2xs font-extrabold" : "text-white/80 hover:bg-white/10"
            )}
          >
            Tất cả ({insights.length})
          </button>
        </div>
      </div>

      {/* Insights List Grid */}
      {filtered.length === 0 ? (
        <div className="p-14 text-center rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col items-center gap-2 text-gray-500">
          <span className="text-4xl">🎉</span>
          <p className="text-sm font-black text-gray-900">Tất cả các điểm nghẽn bài học đều đã được giải quyết!</p>
          <p className="text-xs max-w-md">Các chỉ số tương tác bài giảng của bạn đang ở tình trạng tối ưu hóa xuất sắc.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={twMerge(
                "p-5 rounded-2xl bg-white border transition-all duration-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5",
                item.priority === "high" && !item.isResolved
                  ? "border-rose-200 bg-rose-50/10"
                  : "border-gray-200",
                item.isResolved && "opacity-60 bg-gray-50/50 border-gray-200"
              )}
            >
              <div className="flex flex-col gap-2.5 flex-1">
                {/* Title & Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={twMerge(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      item.issueType === "rewind_spike" && "bg-amber-50 text-amber-800 border-amber-200",
                      item.issueType === "quiz_failure" && "bg-rose-50 text-rose-800 border-rose-200",
                      item.issueType === "drop_off" && "bg-purple-50 text-purple-800 border-purple-200"
                    )}
                  >
                    {item.issueType === "rewind_spike" && "🔄 Tần suất tua lại cao"}
                    {item.issueType === "quiz_failure" && "⚠️ Khó khăn làm bài"}
                    {item.issueType === "drop_off" && "📉 Nguy cơ rời bài"}
                  </span>

                  <span className="text-sm font-extrabold text-gray-900">{item.lessonTitle}</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-xs font-black border border-gray-200">
                    ⏱️ {item.timestamp}
                  </span>
                </div>

                {/* Telemetry metric explanation */}
                <p className="text-xs font-bold text-gray-600 pl-1">
                  📊 <span className="text-gray-900 font-black">{item.metricDetail}</span>
                </p>

                {/* AI Rationale & Remediation Suggestion */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs font-medium text-indigo-950 leading-relaxed flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <strong className="font-extrabold text-[#4F46E5]">Đề xuất từ AI MindNova: </strong>
                    {item.aiSuggestion}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => alert(`Đang điều hướng đến studio chỉnh sửa tại mốc ${item.timestamp}...`)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                >
                  ⚡ Tối Ưu Hóa Ngay ➔
                </button>
                {!item.isResolved && (
                  <button
                    type="button"
                    onClick={() => resolveItem(item.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-xs transition-all border border-gray-200 hover:border-emerald-300 cursor-pointer"
                  >
                    ✓ Đánh Dấu Đã Cải Tiến
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