"use client";

import React, { useState } from "react";
import type { CoreConcept, LessonResource } from "../types";
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
 coreConcepts = [
 { id: "concept-1", title: "Superposition (Chồng chập lượng tử)", status: "Mastered", statusColor: "teal", description: "Hệ thống tồn tại đồng thời ở nhiều trạng thái cho đến khi được quan sát hoặc đo đạc." },
 { id: "concept-2", title: "Entanglement (Vướng víu lượng tử)", status: "In Progress", statusColor: "amber", description: "Mối liên kết bất biến giữa các hạt lượng tử, bất kể khoảng cách vật lý trong không gian." },
 { id: "concept-3", title: "Qubits Architecture (Cấu trúc Qubit)", status: "Queued", statusColor: "neutral", description: "Đơn vị kiến trúc nền tảng cho xử lý thông tin toán học lượng tử nâng cao." },
 ],
 lessonResources = [
 { id: "res-pdf", type: "pdf", title: "Superposition_Notes.pdf", meta: "Hướng dẫn PDF • 2.4 MB", url: "#resource-pdf" },
 { id: "res-video", type: "video", title: "Visualizing Qubits.mp4", meta: "Video bài giảng • 14:20", url: "#resource-video" },
 ],
 moduleBadge = "Module 4",
 onAskConcept,
}: ContextPanelProps) {
 const [expandedId, setExpandedId] = useState<string | null>("concept-1");

 return (
 <div aria-label="AI Study Plan Context Inspector" className="w-full bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-7 flex flex-col gap-8">
 
 {/* ─── Inspector Top Header ─── */}
 <div className="flex items-center justify-between pb-4 border-b border-border">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
 Tiến trình & Kiến thức
 </span>
 </div>
 <span className="text-xs font-semibold text-red-700 bg-primary-muted px-3 py-1 rounded-full border border-red-100">
 {moduleBadge}
 </span>
 </div>

 {/* ─── Key Core Concepts Section ─── */}
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-primary-muted text-primary flex items-center justify-center border border-red-100 shadow-sm">
 <Lightbulb className="w-4 h-4" />
 </div>
 <h2 className="text-base font-semibold text-foreground tracking-tight">Khái niệm cốt lõi</h2>
 </div>
 <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md border border-border">{coreConcepts.length} Chủ đề</span>
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
 <span className={`w-2 h-2 rounded-full ${isMastered ? "bg-success-bg0" : isInProgress ? "bg-amber-500" : "bg-stone-300"}`} />
 <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{concept.title}</span>
 </div>
 {isMastered && (
 <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium bg-success-bg px-2 py-0.5 rounded-md border border-emerald-200">
 Đã thành thạo
 </span>
 )}
 {isInProgress && !isMastered && (
 <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
 Đang tìm hiểu
 </span>
 )}
 {!isMastered && !isInProgress && (
 <span className="text-[11px] text-muted-foreground font-medium bg-secondary px-2 py-0.5 rounded-md border border-border">
 Chờ học
 </span>
 )}
 </div>
 <p className="text-xs text-muted-foreground leading-relaxed font-normal pl-4 border-l-2 border-border group-hover:border-red-300 transition-colors">
 {concept.description}
 </p>
 {isExpanded && (
 <div className="mt-4 pt-3 border-t border-border flex flex-col gap-3">
 <div className="flex items-center justify-between text-[11px] font-medium text-primary">
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
 className="w-full py-2 px-3 rounded-lg bg-white border border-border hover:bg-primary-muted hover:border-red-200 hover:text-primary-hover text-stone-700 font-medium text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group/btn"
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
 <div className="w-8 h-8 rounded-xl bg-primary-muted text-primary flex items-center justify-center border border-red-100 shadow-sm">
 <History className="w-4 h-4" />
 </div>
 <h2 className="text-base font-semibold text-foreground tracking-tight">Tài liệu bài giảng</h2>
 </div>
 <span className="text-[11px] font-medium text-success bg-success-bg px-2.5 py-0.5 rounded-md border border-emerald-200">Đã kiểm định</span>
 </div>

 <div className="flex flex-col gap-3">
 {lessonResources.map((res) => {
 const isVideo = res.type === "video" || res.title.endsWith(".mp4");
 return (
 <a
 key={res.id}
 href={res.url || "#"}
 className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white hover:bg-muted border border-border hover:border-red-300 transition-all duration-200 shadow-sm"
 >
 <div className="flex items-center gap-3 min-w-0">
 <div
 className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
 isVideo ? "text-primary bg-primary-muted" : "text-rose-600 bg-rose-50"
 }`}
 >
 {isVideo ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
 </div>
 <div className="min-w-0">
 <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
 {res.title}
 </p>
 <span className="text-xs font-normal text-muted-foreground block mt-0.5">
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

