"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { FileEditIcon, BookOpenIcon, TagIcon, SettingsIcon } from "./icons";

export type EditCourseTab = "overview" | "structure" | "pricing" | "advanced";

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
 id: "structure",
 label: "Cấu trúc bài giảng & Quiz",
 icon: <BookOpenIcon size={16} />,
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
 <div className="w-full bg-white border border-gray-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto hide-scrollbar shadow-sm mt-1 mb-1">
 {tabs.map((tab) => {
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => onChangeTab(tab.id as EditCourseTab)}
 className={twMerge(
 "flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
 isActive
 ? "bg-[#C0392B] text-white shadow-sm"
 : "text-[#8A8478] hover:text-[#2C3039] hover:bg-[#FEFCF9]"
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
