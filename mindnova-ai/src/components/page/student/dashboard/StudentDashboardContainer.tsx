"use client";

import React from "react";
import { AiSuggestionCard } from "./AiSuggestionCard";
import { ContinueLearning } from "./ContinueLearning";
import { ExploreCourses } from "./ExploreCourses";
import { DashboardStatsPanel } from "./DashboardStatsPanel";

export function StudentDashboardContainer() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] p-6 md:p-8 flex flex-col font-sans max-w-[1600px] mx-auto w-full gap-8">
      {/* Hero Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👋</span>
            <span className="text-xs font-mono font-extrabold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 uppercase tracking-wider">
              Trung tâm Lộ trình MindNova
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Chào mừng trở lại, Học viên xuất sắc!
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Bạn đang duy trì phong độ rất ấn tượng trên chuỗi lộ trình phát triển Fullstack &amp; Ứng dụng Trí tuệ Nhân tạo.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3 shrink-0">
          <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 font-black text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-lg">🔥</span>
            <span>Chuỗi 3 Ngày Liên Tiếp!</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="flex flex-col xl:flex-row gap-8 items-start pb-12">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
          <AiSuggestionCard />
          <ContinueLearning />
          <ExploreCourses />
        </div>

        {/* Right Sidebar Stats Panel */}
        <DashboardStatsPanel />
      </div>
    </div>
  );
}
