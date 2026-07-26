"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export interface AIInsightItem {
  id: string;
  lessonTitle: string;
  timestamp: string;
  issueType: "drop_off" | "rewind_spike" | "quiz_failure";
  metricDetail: string;
  aiSuggestion: string;
  priority: "high" | "medium" | "low";
  isResolved: boolean;
}

const INITIAL_INSIGHTS: AIInsightItem[] = [
  {
    id: "ins-1",
    lessonTitle: "Lesson 2.1: Building Type-Safe Server Actions",
    timestamp: "04:12",
    issueType: "rewind_spike",
    metricDetail: "42% of enrolled students rewind at the 4:12 mark (+340% above baseline).",
    aiSuggestion: "Students struggle with serializing complex JavaScript Dates over RSC boundaries. Consider embedding an architectural visual diagram or adding an AI-generated supplementary text summary here.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-2",
    lessonTitle: "Lesson 3.2: Production Challenge (Drizzle ORM)",
    timestamp: "12:05",
    issueType: "quiz_failure",
    metricDetail: "68% failure rate on Question #3 (Connection Pooling syntax).",
    aiSuggestion: "The wording in the quiz distractor #2 creates semantic ambiguity. Use the Rapid-Review Co-Creator to re-generate more precise diagnostic rubrics.",
    priority: "high",
    isResolved: false,
  },
  {
    id: "ins-3",
    lessonTitle: "Lesson 1.2: Configuring App Router Routing",
    timestamp: "18:40",
    issueType: "drop_off",
    metricDetail: "22% session drop-off observed during long CLI setup explanation.",
    aiSuggestion: "Break this segment into two discrete 5-minute video chunks or convert the installation script into a copy-paste interactive Document lesson.",
    priority: "medium",
    isResolved: false,
  },
];

// Leaf UI Presentation Component for Section 2.3 AI Content Improvement Suggestions

export function AIInsightsTab() {
  const [insights, setInsights] = useState<AIInsightItem[]>(INITIAL_INSIGHTS);
  const [filter, setFilter] = useState<"all" | "high" | "unresolved">("unresolved");

  const resolveItem = (id: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isResolved: true } : item))
    );
  };

  const filtered = insights.filter((i) => {
    if (filter === "unresolved") return !i.isResolved;
    if (filter === "high") return i.priority === "high";
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Summary Box */}
      <div className="p-7 rounded-3xl bg-gradient-to-br from-[#1A1A2E] via-[#24264A] to-[#121422] text-white border border-[#4648D4]/40 shadow-[0_15px_50px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-3xl font-black shadow-lg">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">AI Content Improvement Suggestions (Section 2.3)</h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                Live Behavioral Telemetry
              </span>
            </div>
            <p className="text-xs text-gray-300 max-w-xl mt-1">
              System analyzes student video playback drop-offs, rewind frequency spikes, and diagnostic quiz failures to uncover architectural learning bottlenecks in real-time.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setFilter("unresolved")}
            className={twMerge(
              "px-4 py-2 rounded-xl transition-all cursor-pointer",
              filter === "unresolved" ? "bg-[#6B6BFF] text-white shadow-md" : "text-gray-300 hover:bg-white/5"
            )}
          >
            Needs Action ({insights.filter((i) => !i.isResolved).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("high")}
            className={twMerge(
              "px-4 py-2 rounded-xl transition-all cursor-pointer",
              filter === "high" ? "bg-rose-500 text-white shadow-md" : "text-gray-300 hover:bg-white/5"
            )}
          >
            High Priority ({insights.filter((i) => i.priority === "high").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={twMerge(
              "px-4 py-2 rounded-xl transition-all cursor-pointer",
              filter === "all" ? "bg-[#6B6BFF] text-white shadow-md" : "text-gray-300 hover:bg-white/5"
            )}
          >
            All Logs ({insights.length})
          </button>
        </div>
      </div>

      {/* Insights List Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col items-center gap-3 text-gray-400">
          <span className="text-4xl">🎉</span>
          <p className="text-sm font-extrabold text-[#1A1A2E]">All behavioral learning bottlenecks have been resolved!</p>
          <p className="text-xs max-w-md">Your course engagement metrics show optimum pacing with minimal friction or drop-off.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={twMerge(
                "p-6 rounded-3xl bg-white border-2 transition-all duration-200 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
                item.priority === "high" && !item.isResolved
                  ? "border-rose-300/80 bg-gradient-to-r from-rose-50/20 to-white"
                  : "border-[#EAEAF4]",
                item.isResolved && "opacity-60 bg-gray-50/50"
              )}
            >
              <div className="flex flex-col gap-3 flex-1">
                {/* Title & Badge */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={twMerge(
                      "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border",
                      item.issueType === "rewind_spike" && "bg-amber-50 text-amber-800 border-amber-300",
                      item.issueType === "quiz_failure" && "bg-rose-50 text-rose-800 border-rose-300",
                      item.issueType === "drop_off" && "bg-purple-50 text-purple-800 border-purple-300"
                    )}
                  >
                    {item.issueType === "rewind_spike" && "🔄 Rewind Spike"}
                    {item.issueType === "quiz_failure" && "⚠️ Quiz Failure"}
                    {item.issueType === "drop_off" && "📉 Drop-off Risk"}
                  </span>

                  <span className="text-sm font-black text-[#1A1A2E]">{item.lessonTitle}</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs font-extrabold border border-gray-200">
                    ⏱️ {item.timestamp}
                  </span>
                </div>

                {/* Telemetry metric explanation */}
                <p className="text-xs font-bold text-gray-600 pl-1">
                  📊 <span className="text-gray-900 font-extrabold">{item.metricDetail}</span>
                </p>

                {/* AI Rationale & Remediation Suggestion */}
                <div className="p-4 rounded-2xl bg-[#F0F0FF] border border-[#D5D5FF]/60 text-xs font-medium text-[#2E2F5B] leading-relaxed flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <strong className="font-extrabold text-[#5153DF]">AI Remediation Recommendation: </strong>
                    {item.aiSuggestion}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => alert(`Navigating to editor at timestamp ${item.timestamp}...`)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:opacity-95 text-white text-xs font-extrabold shadow-md transition-all whitespace-nowrap cursor-pointer"
                >
                  ⚡ Take Action Now ➔
                </button>
                {!item.isResolved && (
                  <button
                    type="button"
                    onClick={() => resolveItem(item.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-extrabold text-xs transition-all border border-gray-200 hover:border-emerald-300"
                  >
                    ✓ Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
