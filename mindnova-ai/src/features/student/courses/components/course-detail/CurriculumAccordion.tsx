"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { BookX, ChevronDown, ChevronUp } from "lucide-react";
import type { CourseDetailModuleItem, CourseDetailLessonItem } from "../../types";
import toast from "react-hot-toast";
import { LessonStatusIcon, lessonDisplayTitle } from "../LessonStatusIcon";

// ─── Lesson Item Row ──────────────────────────────────────────────────────────
function LessonItemRow({ lesson, courseId, isEnrolled }: { lesson: CourseDetailLessonItem; courseId: string | number; isEnrolled: boolean }) {
 // Learning states only make sense once the student owns the course.
 const isCompleted = isEnrolled && lesson.status === "completed";
 const isCurrent = isEnrolled && lesson.status === "current";
 const isLocked = !isEnrolled || lesson.status === "locked";

 const content = (
 <div className={twMerge(
 "flex items-center justify-between py-3.5 px-5 rounded-lg border transition-all duration-200 text-decoration-none group/lesson",
 isCurrent 
 ? "bg-blue-50 border-blue-500" 
 : isCompleted
 ? "bg-slate-50 border-slate-200 hover:bg-slate-50 hover:border-slate-400"
 : "bg-slate-100 border-slate-200 hover:bg-slate-200 opacity-80"
 )}>
 <div className="flex items-center gap-3.5 min-w-0">
 <div className={twMerge(
 "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform font-bold text-xs",
 isCompleted ? "bg-slate-900 border-slate-900 text-white" :
 isCurrent ? "bg-blue-500 border-blue-500 text-white" :
 "bg-white border-slate-200 text-slate-500"
 )}>
 <LessonStatusIcon lesson={lesson} />
 </div>

 <div className="min-w-0">
 <span className={twMerge(
 "text-xs sm:text-sm font-bold truncate block transition-colors",
 isLocked ? "text-slate-500" : (isCurrent ? "text-slate-900" : "text-slate-500 group-hover/lesson:text-slate-900")
 )}>
 {lessonDisplayTitle(lesson.title)}
 </span>
 {isCurrent && (
 <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mt-1">
 Đang học
 </span>
 )}
 </div>
 </div>

 <div className="shrink-0 flex items-center gap-2.5 ml-4">
 {isCompleted && (
 <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider hidden sm:inline-block">
 Hoàn thành
 </span>
 )}
 {isLocked && (
 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
 Khóa
 </span>
 )}
 <span className={twMerge(
 "text-xs font-bold px-2.5 py-1 rounded-md border",
 isCurrent 
 ? "text-blue-700 bg-blue-100 border-transparent" 
 : "text-slate-500 bg-white border-slate-200"
 )}>
 {lesson.duration}
 </span>
 </div>
 </div>
 );

 if (isLocked) {
 return (
 <div 
 onClick={() => toast(isEnrolled ? "Vui lòng hoàn tất các bài học trước để mở khóa bài học này." : "Đăng ký khóa học để bắt đầu học bài này.")}
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
export function CurriculumAccordion({ modules = [], courseId, isEnrolled = false }: { modules?: CourseDetailModuleItem[], courseId: string | number, isEnrolled?: boolean }) {
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
 <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-sm">
 {/* Header section */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
 Giáo trình & Học phần
 </span>
 </div>
 <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
 Nội dung chương trình đào tạo
 </h2>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-xs font-medium text-blue-600">
 {modules.length} Modules • <strong className="font-semibold">{totalLessons} Bài giảng</strong>
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
 className="text-xs font-medium text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-transparent hover:bg-slate-100 transition-colors cursor-pointer"
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
 isExpanded ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-400"
 }`}
 >
 {/* Module Toggle Bar */}
 <button
 type="button"
 onClick={() => toggleModule(modKey)}
 className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-transparent hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
 >
 <div className="flex items-center gap-3 sm:gap-4 min-w-0">
 <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
 {String(modIdx + 1).padStart(2, "0")}
 </div>
 <div className="min-w-0">
 <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate group-hover:text-blue-600">
 {module.title}
 </h3>
 <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-500">
 <span>{totalInMod} Bài giảng</span>
 <span className="w-1 h-1 rounded-full bg-slate-400" />
 <span>{module.duration || "2.5 giờ"}</span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-4 shrink-0">
 <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md hidden sm:inline-block ${
 completedInMod === totalInMod && totalInMod > 0
 ? "bg-emerald-50 text-emerald-500 border-none"
 : "bg-slate-100 text-slate-500 border-none"
 }`}>
 {isEnrolled ? `${completedInMod}/${totalInMod} Đã học` : `${totalInMod} bài học`}
 </span>
 <div className="w-8 h-8 rounded-lg bg-transparent text-slate-400 flex items-center justify-center shrink-0">
 {isExpanded ? <ChevronUp size={18} strokeWidth={2} aria-hidden /> : <ChevronDown size={18} strokeWidth={2} aria-hidden />}
 </div>
 </div>
 </button>

 {/* Expanded Lesson Items */}
 {isExpanded && (
 <div className="p-4 pt-0 space-y-2.5 border-t border-slate-200">
 <div className="pt-4 space-y-2.5">
 {module.lessons && module.lessons.map((lesson, lessonIdx) => (
 <LessonItemRow key={lesson.id || lessonIdx} lesson={lesson} courseId={courseId} isEnrolled={isEnrolled} />
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
