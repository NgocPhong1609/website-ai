"use client";

import React from "react";

export function AiSuggestionCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-indigo-200 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0 text-2xl shadow-2xs">
          🤖
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black text-[#4F46E5] bg-indigo-50 border border-indigo-100 uppercase tracking-wider font-mono">
              ⚡ Gia Sư AI Nova Đề Xuất
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
              Ưu tiên học ngay
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-900 leading-snug mb-1.5">
            Bước Tiếp Theo Tối Ưu Hóa (Smart Next Step)
          </h3>
          <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-4">
            Tuyệt vời! Bạn vừa vượt qua bài kiểm tra <strong>Route Handlers</strong> với điểm số xuất sắc. Bước tiếp theo, hãy chinh phục chuyên đề <strong>&apos;Server Actions &amp; Streaming&apos;</strong> để làm chủ cơ sở dữ liệu động.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-500 mb-5 font-mono">
            <span className="flex items-center gap-1.5">
              <span>🎯</span>
              <span>Lý do: Phù hợp năng lực hiện tại</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>⏱️</span>
              <span>Thời lượng ước tính: ~25 phút</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => window.location.href = "/study-plan"}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-2xs cursor-pointer active:scale-[0.99] uppercase tracking-wider"
            >
              ⚡ Vào học chuyên đề ngay ➔
            </button>
            <button
              type="button"
              onClick={() => window.location.href = "/progress"}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer uppercase tracking-wider"
            >
              Xem chi tiết lộ trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
