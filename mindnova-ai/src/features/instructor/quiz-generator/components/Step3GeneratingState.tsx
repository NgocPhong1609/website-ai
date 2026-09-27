"use client";

import React, { useEffect, useState } from "react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { Sparkles } from "lucide-react";

export function Step3GeneratingState() {
 const [currentProgressStep, setCurrentProgressStep] = useState(0);

 const steps = [
 "1. Đang quét & đọc toàn bộ nội dung chi tiết các bài học...",
 "2. Trích xuất kiến thức trọng tâm & xây dựng ma trận đề thi...",
 "3. Sinh bộ câu hỏi trắc nghiệm kèm giải thích...",
 "4. Phân tích câu hỏi tự luận & lập đáp án tham khảo...",
 "5. Chuẩn hóa Rubric chấm điểm & hoàn thiện bài thi...",
 ];

 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
 }, 2500);

 return () => clearInterval(timer);
 }, [steps.length]);

 return (
 <div className="p-12 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center gap-6 animate-fadeIn min-h-[420px]">
 {/* Icon Spin & Glowing Orb */}
 <div className="relative flex items-center justify-center">
 <div className="w-24 h-24 rounded-full bg-blue-500 text-blue-500 blur-xl opacity-40 animate-pulse" />
 <div className="absolute w-20 h-20 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-2xl animate-bounce">
 <Sparkles className="h-9 w-9" aria-hidden />
 </div>
 </div>

 <div className="flex flex-col gap-2 max-w-md">
 <h3 className="text-xl font-bold text-slate-900">AI Đang Phân Tích & Sinh Đề Kiểm Tra...</h3>
 <p className="text-xs text-slate-500 font-semibold leading-relaxed">
 AI đang tạo câu hỏi từ nội dung bạn đã chọn. Quá trình có thể mất đến 3 phút; vui lòng giữ trang này mở.
 </p>
 </div>

 <div className="w-full max-w-md flex flex-col gap-3">
 <div className="p-4 rounded-lg bg-[#FAF8FF] border-slate-200 flex items-center gap-3">
 <Loader size="sm" />
 <span className="text-xs font-semibold text-blue-500 animate-pulse">
 {steps[currentProgressStep]}
 </span>
 </div>

 {/* Step Indicators */}
 <div className="flex items-center justify-between px-2">
 {steps.map((_, idx) => (
 <div
 key={idx}
 className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${
 idx <= currentProgressStep ? "bg-blue-500" : "bg-gray-200"
 }`}
 />
 ))}
 </div>
 </div>
 </div>
 );
}
