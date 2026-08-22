"use client";

import React from "react";
import { QuizConfig } from "../types/quizGenerator.types";

interface Step1SourceInputProps {
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onNext: () => void;
}

export function Step1SourceInput({ config, onChangeConfig, onNext }: Step1SourceInputProps) {
  const isContentValid =
    config.source_type === "content" ? config.source_content.trim().length >= 10 : config.topic.trim().length >= 3;

  return (
    <div className="p-8 bg-white rounded-3xl border border-[#EAEAF4] shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-[#4F46E5] text-xs font-black rounded-lg border border-indigo-100 uppercase tracking-wider">
            Bước 1 / 5
          </span>
          <h2 className="text-xl font-black text-[#1A1A2E]">Nguồn Dữ Liệu Tạo Đề Bài Kiểm Tra</h2>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Chọn một trong hai phương thức bên dưới để AI tự động phân tích ngữ cảnh và trích xuất câu hỏi chuẩn xác.
        </p>
      </div>

      {/* Tabs Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tab 1: Content-Based */}
        <button
          type="button"
          onClick={() => onChangeConfig({ source_type: "content" })}
          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
            config.source_type === "content"
              ? "border-[#4F46E5] bg-indigo-50/30 shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#4F46E5] flex items-center justify-center text-xl font-bold">
              📜
            </div>
            <input
              type="radio"
              checked={config.source_type === "content"}
              onChange={() => onChangeConfig({ source_type: "content" })}
              className="w-4 h-4 text-[#4F46E5]"
            />
          </div>
          <h3 className="text-sm font-extrabold text-[#1A1A2E]">1. Dán Nội Dung / Bài Học</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Dán bài giảng, tài liệu PDF, đoạn văn hoặc ghi chú chuyên môn. AI sẽ đọc hiểu để tạo câu hỏi bám sát.
          </p>
        </button>

        {/* Tab 2: Topic-Based */}
        <button
          type="button"
          onClick={() => onChangeConfig({ source_type: "topic" })}
          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
            config.source_type === "topic"
              ? "border-[#4F46E5] bg-indigo-50/30 shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
              💡
            </div>
            <input
              type="radio"
              checked={config.source_type === "topic"}
              onChange={() => onChangeConfig({ source_type: "topic" })}
              className="w-4 h-4 text-[#4F46E5]"
            />
          </div>
          <h3 className="text-sm font-extrabold text-[#1A1A2E]">2. Tạo Theo Chủ Đề Tự Nhiên</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Nhập tên chủ đề hoặc prompt ngắn (VD: "Toán nhị phân", "React Context API"). AI tự mở rộng kiến thức.
          </p>
        </button>
      </div>

      {/* Input Field Based on Selection */}
      {config.source_type === "content" ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <span>Nội dung tài liệu / Bài giảng (Tối thiểu 10 ký tự)</span>
            <span className="text-gray-400 font-mono text-[11px]">{config.source_content.length} ký tự</span>
          </label>
          <textarea
            value={config.source_content}
            onChange={(e) => onChangeConfig({ source_content: e.target.value })}
            rows={7}
            placeholder="Dán nội dung bài học, tài liệu lý thuyết hoặc ghi chú khóa học vào đây..."
            className="w-full p-4 rounded-2xl border border-gray-200 bg-[#FAF8FF] text-xs font-medium text-gray-800 leading-relaxed focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all shadow-inner"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700">Chủ đề hoặc Yêu cầu kiến thức (Topic)</label>
          <input
            type="text"
            value={config.topic}
            onChange={(e) => onChangeConfig({ topic: e.target.value })}
            placeholder="VD: Toán nhị phân và logic máy tính, JavaScript ES6 Async/Await..."
            className="w-full p-4 rounded-2xl border border-gray-200 bg-[#FAF8FF] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all shadow-inner"
          />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-gray-400">Gợi ý chủ đề nhanh:</span>
            {["Hệ nhị phân", "React Hooks", "Cấu trúc dữ liệu & Giải thuật", "SQL Join & Index"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChangeConfig({ topic: item })}
                className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-[#4F46E5] text-gray-600 text-[11px] font-extrabold rounded-lg transition-all"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-end border-t border-gray-100 pt-4 mt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!isContentValid}
          className="px-8 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white font-black text-xs rounded-2xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          Tiếp theo: Cấu hình thông số ➜
        </button>
      </div>
    </div>
  );
}
