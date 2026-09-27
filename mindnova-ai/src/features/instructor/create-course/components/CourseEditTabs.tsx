"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

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
 },
 {
 id: "structure",
 label: "Cấu trúc bài giảng & Quiz",
 },
 {
 id: "pricing",
 label: "Giá bán & Khuyến mãi",
 },
 {
 id: "advanced",
 label: "Cài đặt nâng cao",
 },
 ] as const;

 return (
 <div className="w-full bg-white border border-slate-200 p-1.5 rounded-lg flex items-center gap-1.5 overflow-x-auto hide-scrollbar shadow-sm mt-1 mb-1">
 {tabs.map((tab) => {
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => onChangeTab(tab.id as EditCourseTab)}
 className={twMerge(
 "flex-1 flex justify-center items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
 isActive
 ? "bg-blue-50 text-blue-700 shadow-sm"
 : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
 )}
 >
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>
 );
}

