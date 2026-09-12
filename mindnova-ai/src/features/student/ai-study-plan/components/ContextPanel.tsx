"use client";

import React, { useState } from "react";
import type { CoreConcept, LessonResource } from "../types";
import { formatStudyDuration } from "../lib/format-study-duration";
import {
 Lightbulb,
 History,
 FileText,
 PlayCircle,
 ChevronDown,
 ChevronUp,
 MessageCircleQuestion
} from "lucide-react";

interface ContextPanelProps {
 coreConcepts?: CoreConcept[];
 lessonResources?: LessonResource[];
 aiInsight?: string;
 moduleBadge?: string;
 onAskConcept?: (query: string) => void;
}

 export function ContextPanel({
 coreConcepts = [],
 lessonResources = [],
 moduleBadge = "Khóa học",
 onAskConcept,
}: ContextPanelProps) {
 const [expandedId, setExpandedId] = useState<string | null>("concept-1");

 return (
 <div aria-label="AI Study Plan Context Inspector" className="w-full bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-7 flex flex-col gap-8">
 
 {/* ─── Inspector Top Header ─── */}
 <div className="flex items-center justify-between pb-4 border-b border-border">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
 <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
 Tiến trình & Kiến thức
 </span>
 </div>
 <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
 {moduleBadge}
 </span>
 </div>

 {/* ─── Key Core Concepts Section ─── */}
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
 <Lightbulb className="w-4 h-4" />
 </div>
 <h2 className="text-base font-semibold text-slate-900 tracking-tight">Khái niệm cốt lõi</h2>
 </div>
 <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">{coreConcepts.length} Chủ đề</span>
 </div>

 <div className="flex flex-col gap-3">
 {coreConcepts.map((concept) => {
 const isMastered = concept.status === "Mastered" || concept.status === "Đã thành thạo" || concept.statusColor === "teal";
 const isInProgress = concept.status === "In Progress" || concept.status === "Đang tìm hiểu" || concept.statusColor === "amber";
 const isExpanded = expandedId === concept.id;

 return (
 <div
 key={concept.id}
 onClick={() => setExpandedId(isExpanded ? null : concept.id)}
 className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
 isExpanded
 ? "bg-muted border-stone-300 shadow-sm"
 : "bg-white border-border hover:border-stone-300 hover:bg-muted"
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 <span className={`w-2 h-2 rounded-full ${isMastered ? "bg-emerald-500" : isInProgress ? "bg-blue-500" : "bg-slate-300"}`} />
 <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{concept.title}</span>
 </div>
 {isMastered && (
 <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
 Đã thành thạo
 </span>
 )}
 {isInProgress && !isMastered && (
 <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
 Đang tìm hiểu
 </span>
 )}
 {!isMastered && !isInProgress && (
 <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
 Chờ học
 </span>
 )}
 </div>
 <p className="text-xs text-slate-500 leading-relaxed font-normal pl-4 border-l-2 border-slate-200 group-hover:border-blue-300 transition-colors">
 {formatStudyDuration(concept.description)}
 </p>
 {isExpanded && (
 <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
 <div className="flex items-center justify-between text-[11px] font-medium text-blue-600">
 <span>Đang tích hợp trong bộ nhớ AI</span>
 <span className="flex items-center gap-1 hover:underline cursor-pointer">
 {isExpanded ? "Thu gọn" : "Chi tiết"}
 {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
 </span>
 </div>
 {onAskConcept && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 onAskConcept(`Nova ơi, hãy giải thích sâu hơn giúp mình về khái niệm: **${concept.title}** (bản chất lý do, nguyên lý hoạt động và ví dụ ứng dụng thực tế) nhé!`);
 }}
 className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-700 font-medium text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group/btn"
 >
 <MessageCircleQuestion className="w-3.5 h-3.5" />
 <span>Hỏi Gia sư Nova về chủ đề này</span>
 </button>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* ─── Curated Lesson Resources Section ─── */}
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
 <History className="w-4 h-4" />
 </div>
 <h2 className="text-base font-semibold text-slate-900 tracking-tight">Tài liệu bài giảng</h2>
 </div>
 <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Đã kiểm định</span>
 </div>

 <div className="flex flex-col gap-3">
 {lessonResources.map((res) => {
 const isVideo = res.type === "video" || res.title.endsWith(".mp4");
 return (
 <a
 key={res.id}
 href={res.url || "#"}
 className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-sm"
 >
 <div className="flex items-center gap-3 min-w-0">
 <div
 className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
 isVideo ? "text-blue-600 bg-blue-50" : "text-slate-600 bg-slate-100"
 }`}
 >
 {isVideo ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
 </div>
 <div className="min-w-0">
 <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
 {res.title}
 </p>
 <span className="text-xs font-normal text-slate-500 block mt-0.5">
 {res.meta}
 </span>
 </div>
 </div>
 </a>
 );
 })}
 </div>
 </div>
 </div>
 );
}

