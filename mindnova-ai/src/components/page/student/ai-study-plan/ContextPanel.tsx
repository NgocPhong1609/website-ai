"use client";

import React, { useState, useEffect } from "react";
import { LightbulbIcon, PlayCircleIcon } from "./icons";
import { RoadmapGenerator } from "./RoadmapGenerator";
import { AIFlashcards } from "./AIFlashcards";
import type { ILessonSummary } from "@/src/types/student";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";

export function ContextPanel() {
  const [activeTab, setActiveTab] = useState<"summary" | "roadmap" | "flashcards">("summary");
  const [summary, setSummary] = useState<ILessonSummary | null>(null);

  useEffect(() => {
    // Simulate fetching pre-computed background lesson summary
    const timer = setTimeout(() => {
      setSummary({
        lessonId: 101,
        summary:
          "Học phần này đào sâu vào kiến trúc phát triển phần mềm Fullstack hiện đại tích hợp AI, chú trọng việc tối ưu luồng trạng thái (State Management) và xử lý dữ liệu thời gian thực cho ứng dụng doanh nghiệp.",
        keyTakeaways: [
          "Tối ưu hóa khả năng phản hồi và bộ nhớ đệm (Cache) trong môi trường phân tán.",
          "Chuẩn hóa mô hình AI Tutor 24/7 để đồng hành và trả lời các thắc mắc kỹ thuật phức tạp.",
          "Thực chiến thiết kế lộ trình 80% thực hành theo mô hình Node-based tinh gọn.",
        ],
        nextLessonRecommendation: {
          lessonId: COURSE_DETAIL.nextLessonId || 202,
          title: COURSE_DETAIL.nextLesson || "Tối ưu hóa Route Handlers & Webhook",
          reason: "Bước đệm hoàn hảo để mở khóa Chứng chỉ Blockchain trên sàn MindNova.",
        },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="p-6 pb-0 border-b border-gray-100 bg-gray-50/40">
        <h3 className="text-[11px] font-extrabold tracking-widest text-[#4F46E5] uppercase mb-1.5 font-mono">
          Bối Cảnh & Học Liệu
        </h3>
        <h1 className="text-xl font-black text-gray-900 leading-tight mb-4">
          Nền Tảng Lập Trình &amp;
          <br />
          Lộ Trình Tối Ưu AI
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-200/50">
            <div className="w-[65%] h-full bg-[#4F46E5] rounded-full transition-all duration-500" />
          </div>
          <span className="text-xs font-black text-[#4F46E5] shrink-0 font-mono">
            65% Hoàn tất
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center px-4 pt-3 bg-white border-b border-gray-200 overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "summary"
              ? "border-[#4F46E5] text-[#4F46E5]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          📑 Tóm tắt Bài giảng
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "roadmap"
              ? "border-[#4F46E5] text-[#4F46E5]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          🗺️ Lộ trình AI Động
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("flashcards")}
          className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "flashcards"
              ? "border-[#4F46E5] text-[#4F46E5]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          🗂️ Thẻ ôn tập Flashcard
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === "summary" && (
          <div className="animate-in fade-in duration-300">
            {!summary ? (
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-full w-4/6 animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Pre-computed Summary */}
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold p-4 rounded-xl bg-indigo-50/40 border border-indigo-100/60">
                    {summary.summary}
                  </p>

                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <LightbulbIcon className="w-4 h-4 text-[#4F46E5]" />
                    <h2 className="text-sm font-black text-gray-900">Kiến thức Cốt lõi (Key Takeaways)</h2>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {summary.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed font-semibold">
                        <span className="text-[#4F46E5] shrink-0 mt-0.5 font-black">✔</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Lesson Recommendation */}
                {summary.nextLessonRecommendation && (
                  <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-2xl p-5 border border-gray-200 shadow-2xs mt-4">
                    <h3 className="text-[10px] font-black tracking-wider text-gray-400 uppercase mb-2.5">
                      💡 AI Đề xuất Bước tiếp theo
                    </h3>
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <PlayCircleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-black text-gray-900 truncate">
                          {summary.nextLessonRecommendation.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {summary.nextLessonRecommendation.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="animate-in fade-in duration-300">
            <RoadmapGenerator />
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="animate-in fade-in duration-300">
            <AIFlashcards />
          </div>
        )}
      </div>
    </div>
  );
}
