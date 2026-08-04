"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { FileEditIcon, BookOpenIcon, TagIcon, SettingsIcon } from "./icons";

export type EditCourseTab = "overview" | "pricing" | "advanced";

interface CourseEditTabsProps {
  activeTab: EditCourseTab;
  onChangeTab: (tab: EditCourseTab) => void;
}

export function CourseEditTabs({ activeTab, onChangeTab }: CourseEditTabsProps) {
  const tabs = [
    {
      id: "overview",
      label: "Thông tin tổng quan & SEO",
      icon: <FileEditIcon size={16} />,
    },
    {
      id: "pricing",
      label: "Giá bán & Khuyến mãi",
      icon: <TagIcon size={16} />,
    },
    {
      id: "advanced",
      label: "Cài đặt nâng cao",
      icon: <SettingsIcon size={16} />,
    },
  ] as const;

  return (
    <div className="w-full bg-white border border-gray-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto hide-scrollbar shadow-sm mb-6 mt-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id as EditCourseTab)}
            className={twMerge(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <span className={twMerge(isActive ? "text-white" : "text-gray-400")}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
