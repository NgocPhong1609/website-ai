"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { BookX } from "lucide-react";
import type { CourseDetailModuleItem, CourseDetailLessonItem } from "../../types";
import toast from "react-hot-toast";

// ─── Lesson Item Row ──────────────────────────────────────────────────────────
function LessonItemRow({ lesson, courseId }: { lesson: CourseDetailLessonItem; courseId: string | number }) {
 const isCompleted = lesson.status === "completed";
 const isCurrent = lesson.status === "current";
 const isLocked = lesson.status === "locked";

 const content = (
 <div className={twMerge(
 "flex items-center justify-between py-3.5 px-5 rounded-lg border transition-all duration-200 text-decoration-none group/lesson",
 isCurrent 
 ? "bg-white border-[#0F172A]" 
 : isCompleted
 ? "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#94A3B8]"
 : "bg-[#F1F5F9] border-[#E2E8F0] hover:bg-[#E2E8F0] opacity-80"
 )}>
 <div className="flex items-center gap-3.5 min-w-0">
 <div className={twMerge(
 "w-8 h-8 rounded border flex items-center justify-center shrink-0 transition-transform font-bold text-xs",
 isCompleted ? "bg-[#0F172A] border-[#0F172A] text-white" :
 isCurrent ? "bg-[#0F172A] border-[#0F172A] text-white" :
 "bg-white border-[#E2E8F0] text-[#64748B]"
 )}>
 {isCompleted && ""}
 {isCurrent && "▶"}
 {isLocked && ""}
 </div>

 <div className="min-w-0">
 <span className={twMerge(
 "text-xs sm:text-sm font-bold truncate block transition-colors",
 isLocked ? "text-[#64748B]" : (isCurrent ? "text-[#0F172A]" : "text-[#64748B] group-hover/lesson:text-[#0F172A]")
 )}>
 {lesson.title}
 </span>
 {isCurrent && (
 <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider block mt-1">
 Đang học
 </span>
 )}
 </div>
 </div>

 <div className="shrink-0 flex items-center gap-2.5 ml-4">
 {isCompleted && (
 <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider hidden sm:inline-block">
 Hoàn thành
 </span>
 )}
 {isLocked && (
 <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider hidden sm:inline-block">
 Khóa
 </span>
 )}
 <span className={twMerge(
 "text-xs font-bold px-2.5 py-1 rounded border",
 isCurrent 
 ? "text-[#0F172A] bg-white border-[#0F172A]" 
 : "text-[#64748B] bg-white border-[#E2E8F0]"
 )}>
 {lesson.duration}
 </span>
 </div>
 </div>
 );

 if (isLocked) {
 return (
 <div 
 onClick={() => toast("Vui lòng hoàn tất các bài học trước để tự động mở khóa bài học này!")}
 className="block cursor-not-allowed"
 >
 {content}
 </div>
 );
 }

 return (
 <Link href={`/courses/lesson?courseId=${courseId}&lessonId=${lesson.id}`} className="text-decoration-none block">
 {content}
 </Link>
 );
}

// ─── Main Accordion Component ─────────────────────────────────────────────────
export function CurriculumAccordion({ modules = [], courseId = 1 }: { modules?: CourseDetailModuleItem[], courseId?: string | number }) {
 const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

 // Automatically expand all modules on initial render so user sees full curriculum
 useEffect(() => {
 if (modules && modules.length > 0) {
 const initMap: Record<string, boolean> = {};
 modules.forEach((mod, idx) => {
 initMap[String(mod.id || idx)] = true;
 });
 setExpandedMap(initMap);
 }
 }, [modules]);

 const toggleModule = (modKey: string) => {
 setExpandedMap((prev) => ({
 ...prev,
 [modKey]: !prev[modKey],
 }));
 };

 const totalLessons = modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);

 return (
 <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 shadow-sm">
 {/* Header section */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E2E8F0]">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
 Giáo trình & Học phần
 </span>
 </div>
 <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-serif">
 Nội dung chương trình đào tạo
 </h2>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <div className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#64748B]">
 {modules.length} Modules • <strong className="text-[#0F172A]">{totalLessons} Bài giảng</strong>
 </div>

 <button
 type="button"
 onClick={() => {
 const allExpanded = Object.values(expandedMap).every(Boolean);
 const newMap: Record<string, boolean> = {};
 modules.forEach((mod, idx) => {
 newMap[String(mod.id || idx)] = !allExpanded;
 });
 setExpandedMap(newMap);
 }}
 className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
 >
 {Object.values(expandedMap).every(Boolean) ? "Thu nhỏ tất cả" : "Mở rộng tất cả"}
 </button>
 </div>
 </div>

 {/* Modules list */}
 <div className="space-y-4">
 {modules && modules.length > 0 ? (
 modules.map((module, modIdx) => {
 const modKey = String(module.id || modIdx);
 const isExpanded = !!expandedMap[modKey];
 const completedInMod = module.lessons?.filter(l => l.status === 'completed').length || 0;
 const totalInMod = module.lessons?.length || 0;

 return (
 <div 
 key={modKey} 
 className={`rounded-xl border transition-all duration-200 overflow-hidden ${
 isExpanded ? "border-[#94A3B8] bg-[#F8FAFC]" : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
 }`}
 >
 {/* Module Toggle Bar */}
 <button
 type="button"
 onClick={() => toggleModule(modKey)}
 className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-transparent hover:bg-[#F8FAFC] transition-colors cursor-pointer focus:outline-none"
 >
 <div className="flex items-center gap-3 sm:gap-4 min-w-0">
 <div className="w-10 h-10 rounded border border-[#E2E8F0] bg-white text-[#0F172A] font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 font-serif">
 {String(modIdx + 1).padStart(2, "0")}
 </div>
 <div className="min-w-0">
 <h3 className="text-sm sm:text-base font-bold text-[#0F172A] truncate group-hover:text-[#2563EB]">
 {module.title}
 </h3>
 <div className="flex items-center gap-2 mt-1 text-xs font-bold text-[#64748B]">
 <span>{totalInMod} Bài giảng</span>
 <span className="w-1 h-1 rounded-full bg-[#94A3B8]" />
 <span>{module.duration || "2.5 giờ"}</span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-4 shrink-0">
 <span className={`text-[11px] font-bold px-2.5 py-1 rounded border hidden sm:inline-block ${
 completedInMod === totalInMod && totalInMod > 0
 ? "bg-[#E8F6F3] text-[#0F172A] border-[#0F172A]/20"
 : "bg-white text-[#64748B] border-[#E2E8F0]"
 }`}>
 {completedInMod}/{totalInMod} Đã học
 </span>
 <div className="w-8 h-8 rounded border border-[#E2E8F0] bg-white text-[#0F172A] flex items-center justify-center shrink-0 font-bold">
 {isExpanded ? "-" : "+"}
 </div>
 </div>
 </button>

 {/* Expanded Lesson Items */}
 {isExpanded && (
 <div className="p-4 pt-0 space-y-2.5 border-t border-[#E2E8F0]">
 <div className="pt-4 space-y-2.5">
 {module.lessons && module.lessons.map((lesson, lessonIdx) => (
 <LessonItemRow key={lesson.id || lessonIdx} lesson={lesson} courseId={courseId} />
 ))}
 </div>
 </div>
 )}
 </div>
 );
 })
 ) : (
 <NoDataAvailable icon={BookX} title="Chưa có bài giảng" description="Hiện chưa có danh sách bài giảng cho học phần này." variant="compact" />
 )}
 </div>
 </div>
 );
}
