"use client";

import React from "react";
import { ContextPanel } from "./ContextPanel";
import { ChatPanel } from "./ChatPanel";

export function AIStudyPlanContainer() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] p-6 md:p-8 flex flex-col font-sans max-w-[1600px] mx-auto w-full gap-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
            Lộ trình &amp; Gia sư Trí tuệ Nhân tạo (AI Study Plan)
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
            Hệ sinh thái học liệu AI cá nhân hóa MindNova: tự động mô phỏng biểu đồ lộ trình 80/20, ôn tập trắc nghiệm Flashcards và trực tuyến giải đáp mã nguồn cùng <span className="text-[#4F46E5] font-black">Gia sư Nova AI</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-[11px] font-extrabold text-gray-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Nova AI Tutor 24/7</span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-[#4F46E5] text-[11px] font-extrabold border border-indigo-100 shadow-2xs font-mono">
            ⚡ 80% Practical / 20% Theory
          </span>
        </div>
      </div>

      {/* Interactive Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[660px] items-stretch pb-12">
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full">
          <ContextPanel />
        </div>
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col h-full">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
