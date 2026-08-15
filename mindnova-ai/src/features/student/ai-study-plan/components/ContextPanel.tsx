"use client";

import React, { useState } from "react";
import type { CoreConcept, LessonResource } from "../types";
import {
  LightbulbIcon,
  HistoryIcon,
  FileTextIcon,
  PlayCircleIcon,
} from "./icons";

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
    <div aria-label="AI Study Plan Context Inspector" className="w-full bg-white rounded-2xl border border-[#F0F0F8] shadow-sm p-6 sm:p-7 flex flex-col gap-8">
      
      {/* ─── Inspector Top Header ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F8]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wide text-[#5052EE]">
            Tiến trình & Kiến thức
          </span>
        </div>
        <span className="text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5052EE]/20 shadow-2xs">
          {moduleBadge}
        </span>
      </div>

      {/* ─── Key Core Concepts Section ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center border border-[#5052EE]/20 shadow-2xs">
              <LightbulbIcon className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-semibold text-[#1A1A2E] tracking-tight">Khái niệm cốt lõi</h2>
          </div>
          <span className="text-[11px] font-medium text-[#5052EE] bg-[#F8F9FE] px-2.5 py-0.5 rounded-md border border-[#E8EAF4]">{coreConcepts.length} Chủ đề</span>
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
                className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isExpanded
                    ? "bg-[#F8F9FE] border-[#5052EE]/40 shadow-2xs"
                    : "bg-[#F8F9FE]/50 border-[#E8EAF4] hover:border-[#5052EE]/30 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isMastered ? "bg-[#10B981]" : isInProgress ? "bg-[#F59E0B]" : "bg-gray-400"}`} />
                    <span className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#5052EE] transition-colors">{concept.title}</span>
                  </div>
                  {isMastered && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#0D9488] font-medium bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">
                      ✓ Đã thành thạo
                    </span>
                  )}
                  {isInProgress && !isMastered && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#D97706] font-medium bg-[#FFF8EB] px-2.5 py-0.5 rounded-full border border-[#D97706]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                      Đang tìm hiểu
                    </span>
                  )}
                  {!isMastered && !isInProgress && (
                    <span className="text-[11px] text-[#64647A] font-medium bg-[#EAEAF4] px-2.5 py-0.5 rounded-full">
                      Chờ học
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64647A] leading-relaxed font-normal pl-4 border-l-2 border-[#E8EAF4] group-hover:border-[#5052EE] transition-colors">
                  {concept.description}
                </p>
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#E8EAF4] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#5052EE]">
                      <span>Đang tích hợp trong bộ nhớ AI</span>
                      <span className="underline">Nhấp để {isExpanded ? "thu gọn ▲" : "chi tiết ▼"}</span>
                    </div>
                    {onAskConcept && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAskConcept(`Nova ơi, hãy giải thích sâu hơn giúp mình về khái niệm: **${concept.title}** (bản chất lý do, nguyên lý hoạt động và ví dụ ứng dụng thực tế) nhé!`);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#EEF2FF] hover:bg-[#5052EE] text-[#5052EE] hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs group/btn"
                      >
                        <span>💬 Hỏi Gia sư Nova về chủ đề này</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform duration-200">➔</span>
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
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F5] text-[#0D9488] flex items-center justify-center border border-[#0D9488]/20 shadow-2xs">
              <HistoryIcon className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-semibold text-[#1A1A2E] tracking-tight">Tài liệu bài giảng</h2>
          </div>
          <span className="text-[11px] font-medium text-[#0D9488] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">Đã kiểm định</span>
        </div>

        <div className="flex flex-col gap-3">
          {lessonResources.map((res) => {
            const isVideo = res.type === "video" || res.title.endsWith(".mp4");
            return (
              <a
                key={res.id}
                href={res.url || "#"}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FE] hover:bg-[#EEF2FF]/50 border border-[#E8EAF4] hover:border-[#5052EE]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs shrink-0 transition-all duration-200 ${
                      isVideo ? "text-[#10B981] bg-[#EAF8F5] border-[#10B981]/25" : "text-[#5052EE] bg-white border-[#5052EE]/25"
                    }`}
                  >
                    {isVideo ? <PlayCircleIcon className="w-5 h-5" /> : <FileTextIcon className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#1A1A2E] group-hover:text-[#5052EE] transition-colors truncate">
                      {res.title}
                    </p>
                    <span className="text-[11px] font-normal text-[#7878A0] block mt-0.5">
                      {res.meta}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8EAF4] group-hover:border-[#5052EE]/50 group-hover:bg-[#5052EE] group-hover:text-white flex items-center justify-center text-[#5052EE] text-xs font-bold shrink-0 transition-all duration-200 shadow-2xs">
                  ↗
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
