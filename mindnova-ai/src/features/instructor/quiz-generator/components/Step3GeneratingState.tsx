"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@/src/shared/components/ui/Loader";

export function Step3GeneratingState() {
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

  const steps = [
    "1. Phân tích ngữ cảnh nội dung & chủ đề...",
    "2. Trích xuất kiến thức trọng tâm & khái niệm cốt lõi...",
    "3. Sinh bộ câu hỏi trắc nghiệm kèm giải thích...",
    "4. Phân tích câu hỏi tự luận & lập đáp án tham khảo...",
    "5. Chuẩn hóa Rubric chấm điểm & hoàn thiện JSON...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="p-12 bg-white rounded-3xl border border-[#EAEAF4] shadow-sm flex flex-col items-center justify-center text-center gap-6 animate-fadeIn min-h-[420px]">
      {/* Icon Spin & Glowing Orb */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-xl opacity-40 animate-pulse" />
        <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-4xl shadow-2xl animate-bounce">
          🪄
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <h3 className="text-xl font-black text-[#1A1A2E]">AI Đang Phân Tích & Sinh Đề Kiểm Tra...</h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Hệ thống AI đang đọc hiểu toàn bộ thông tin và tạo ma trận câu hỏi phù hợp nhất với cấu hình của bạn.
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-indigo-100 flex items-center gap-3">
          <Loader size="sm" />
          <span className="text-xs font-extrabold text-[#4F46E5] animate-pulse">
            {steps[currentProgressStep]}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between px-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${
                idx <= currentProgressStep ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
