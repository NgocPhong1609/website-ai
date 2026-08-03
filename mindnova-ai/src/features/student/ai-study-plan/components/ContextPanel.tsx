import React from "react";
import type { CoreConcept, LessonResource } from "../types";
import {
  LightbulbIcon,
  HistoryIcon,
  FileTextIcon,
  PlayCircleIcon,
  SparklesIcon,
} from "./icons";

interface ContextPanelProps {
  coreConcepts?: CoreConcept[];
  lessonResources?: LessonResource[];
  aiInsight?: string;
  moduleBadge?: string;
}

export function ContextPanel({
  coreConcepts = [
    { id: "concept-1", title: "Superposition", status: "Mastered", statusColor: "teal", description: "System existing in multiple theoretical states simultaneously until observed." },
    { id: "concept-2", title: "Entanglement", status: "In Progress", statusColor: "amber", description: "Interconnected particle correlations remaining linked across physical distances." },
    { id: "concept-3", title: "Qubits Architecture", status: "Queued", statusColor: "neutral", description: "Basic architectural unit of advanced quantum mathematical information." },
  ],
  lessonResources = [
    { id: "res-pdf", type: "pdf", title: "Superposition_Notes.pdf", meta: "PDF Guide • 2.4 MB", url: "#resource-pdf" },
    { id: "res-video", type: "video", title: "Visualizing Qubits.mp4", meta: "Video Lesson • 14:20", url: "#resource-video" },
  ],
  aiInsight = "Ask Nova to illustrate the Bloch Sphere if you need a tangible 3D mental model for multi-dimensional qubit states.",
  moduleBadge = "Module 4",
}: ContextPanelProps) {
  return (
    <div aria-label="AI Study Plan Context Inspector" className="w-full bg-white rounded-3xl border border-[#E4E4F2] shadow-[0_12px_40px_rgba(26,26,46,0.05)] p-6 sm:p-7 flex flex-col gap-8">
      
      {/* ─── Inspector Top Header ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F8]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse ring-4 ring-[#10B981]/20" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#4648D4]">
            Study Inspector
          </span>
        </div>
        <span className="text-xs font-bold text-[#6B6BFF] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#6B6BFF]/25 shadow-2xs">
          {moduleBadge}
        </span>
      </div>

      {/* ─── Key Core Concepts Section ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6B6BFF]/15 to-[#4CD7F6]/25 text-[#4648D4] flex items-center justify-center shadow-2xs border border-[#6B6BFF]/25">
              <LightbulbIcon className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-bold text-[#1A1A2E] tracking-tight">Core Concepts</h2>
          </div>
          <span className="text-[11px] font-bold text-[#64647A] bg-[#F4F5FB] px-2.5 py-0.5 rounded-full border border-[#EAEAF4]">{coreConcepts.length} Topics</span>
        </div>

        <div className="flex flex-col gap-3">
          {coreConcepts.map((concept) => {
            const isMastered = concept.status === "Mastered" || concept.statusColor === "teal";
            const isInProgress = concept.status === "In Progress" || concept.statusColor === "amber";

            return (
              <div
                key={concept.id}
                className="group p-4 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] hover:border-[#6B6BFF]/50 hover:bg-white hover:shadow-[0_8px_24px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all duration-250"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors">{concept.title}</span>
                  {isMastered && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#0D9488] font-bold bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#10B981]/30 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Mastered
                    </span>
                  )}
                  {isInProgress && !isMastered && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#D97706] font-bold bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                      In Progress
                    </span>
                  )}
                  {!isMastered && !isInProgress && (
                    <span className="text-[11px] text-[#64647A] font-bold bg-[#EAEAF4]/80 px-2.5 py-0.5 rounded-full">
                      {concept.status || "Queued"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64647A] leading-relaxed font-medium">
                  {concept.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Curated Lesson Resources Section ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D1FAE5]/80 text-[#0D9488] flex items-center justify-center shadow-2xs border border-[#10B981]/25">
              <HistoryIcon className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-bold text-[#1A1A2E] tracking-tight">Lesson Resources</h2>
          </div>
          <span className="text-[11px] font-bold text-[#0D9488] bg-[#D1FAE5]/60 px-2.5 py-0.5 rounded-full border border-[#10B981]/20">Verified</span>
        </div>

        <div className="flex flex-col gap-3">
          {lessonResources.map((res) => {
            const isVideo = res.type === "video" || res.title.endsWith(".mp4");
            return (
              <a
                key={res.id}
                href={res.url || "#"}
                className="group flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FE] hover:bg-gradient-to-r hover:from-white hover:to-[#EEF2FF]/50 border border-[#E2E4F0] hover:border-[#6B6BFF]/40 hover:shadow-[0_6px_20px_rgba(107,107,255,0.08)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-white border border-[#E2E4F0] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                      isVideo ? "text-[#10B981] bg-[#D1FAE5]/30 border-[#10B981]/25" : "text-[#6B6BFF] bg-[#EEF2FF] border-[#6B6BFF]/25"
                    }`}
                  >
                    {isVideo ? <PlayCircleIcon className="w-5 h-5" /> : <FileTextIcon className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#1A1A2E] group-hover:text-[#4648D4] transition-colors truncate">
                      {res.title}
                    </p>
                    <span className="text-[11px] font-semibold text-[#8888A8]">{res.meta}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E4E4EE] group-hover:border-[#6B6BFF]/40 group-hover:bg-[#6B6BFF] group-hover:text-white flex items-center justify-center text-[#6B6BFF] text-xs font-bold shrink-0 transition-all duration-200 shadow-2xs">
                  ↗
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ─── Luminous MindNova AI Insight Callout Card ─── */}
      <div className="mt-1 pt-4 border-t border-[#E8EAEE]">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF2FF] via-[#F8F9FF] to-[#E0F2FE] border-2 border-[#6B6BFF]/30 p-5 shadow-[0_8px_24px_rgba(107,107,255,0.08)] hover:shadow-[0_12px_32px_rgba(107,107,255,0.14)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B6BFF]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-[#4648D4] uppercase tracking-wider mb-2">
            <span className="p-1.5 rounded-lg bg-[#6B6BFF] text-white shadow-2xs">
              <SparklesIcon className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
            </span>
            <span>MindNova AI Insight</span>
          </div>
          <p className="relative z-10 text-xs sm:text-[13px] text-[#2E3050] italic leading-relaxed font-semibold pl-1 border-l-2 border-[#6B6BFF]">
            &ldquo;{aiInsight}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
