"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface CoursesHeaderProps {
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  inProgressCount?: number;
  completedCount?: number;
  totalCount?: number;
}

export function CoursesHeader({
  activeTab = "all",
  onTabChange,
  inProgressCount = 3,
  completedCount = 1,
  totalCount = 4,
}: CoursesHeaderProps) {
  const tabs = [
    { key: "all", label: `Tất cả (${totalCount})` },
    { key: "in-progress", label: `Đang học (${inProgressCount})` },
    { key: "completed", label: `Đã hoàn thành (${completedCount})` },
    { key: "not-started", label: "Chưa bắt đầu (0)" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
          Khóa học của tôi
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          Bạn có <span className="text-[#4F46E5] font-extrabold">{inProgressCount} khóa học</span> đang triển khai. Hãy duy trì tiến độ học tập tuyệt vời nhé!
        </p>
      </div>

      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange && onTabChange(tab.key)}
              className={twMerge(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                isActive
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
