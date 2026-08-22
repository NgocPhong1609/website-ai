"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import { Loader } from "@/src/shared/components/ui/Loader";

export default function InstructorQuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizGeneratorApi.getQuizzes()
      .then((res) => {
        if (res?.data) {
          setQuizzes(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load quizzes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 p-6 md:p-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
              🪄
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">AI Quiz Generator Module</h1>
              <p className="text-xs text-indigo-200 font-semibold mt-0.5">
                Quản lý và khởi tạo bài kiểm tra độc lập với sự hỗ trợ từ AI
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/instructor/quiz-generator/create"
          className="px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
        >
          <span>⚡ + Tạo bài kiểm tra AI mới</span>
        </Link>
      </div>

      {/* Main Quizzes List Table / Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#1A1A2E]">Danh Sách Bài Kiểm Tra Của Bạn</h2>
          <span className="text-xs font-bold text-gray-500">Tổng số: {quizzes.length} bài</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader size="md" />
            <span className="text-xs font-bold text-gray-500">Đang tải danh sách bài kiểm tra...</span>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-500">
            <span className="text-5xl">📋</span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-extrabold text-[#1A1A2E]">Bạn chưa tạo bài kiểm tra AI nào</p>
              <p className="text-xs font-medium text-gray-500">
                Hãy nhấn vào nút bên dưới để trải nghiệm tạo bài kiểm tra trắc nghiệm &amp; tự luận trong 5 bước.
              </p>
            </div>
            <Link
              href="/instructor/quiz-generator/create"
              className="mt-2 px-6 py-3 bg-[#4F46E5] text-white text-xs font-black rounded-2xl shadow-md hover:bg-[#4338CA] transition-all"
            >
              ⚡ Tạo đề bằng AI ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white border border-[#EAEAF4] hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                      {q.source_type === "content" ? "📜 Từ tài liệu" : "💡 Từ chủ đề"}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        q.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {q.status === "published" ? "✓ Đã xuất bản" : "✎ Bản nháp"}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1A1A2E] line-clamp-1">{q.title}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{q.description || "Không có mô tả"}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>❓ {q.questions_count || q.total_questions} câu</span>
                    <span>⏱️ {q.time_limit_minutes}p</span>
                    <span>🎯 {q.total_points} đ</span>
                  </div>

                  {q.attachments && q.attachments.length > 0 ? (
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
                      🔗 Đã gắn vào khóa học
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-400">Độc lập</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
