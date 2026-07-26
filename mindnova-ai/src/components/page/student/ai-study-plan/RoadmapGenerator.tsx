"use client";

import React, { useState } from "react";
import type { IRoadmapNode } from "@/src/types/student";

export function RoadmapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmapNode[]>([
    {
      id: "node-1",
      courseTitle: "React 19 & Next.js 15 Foundations",
      targetSkill: "Component Architecture & Server Actions",
      isCompleted: true,
      isCurrent: false,
      isLocked: false,
      practicalPercent: 80,
      theoreticalPercent: 20,
      milestoneBadge: "🏁 Foundation Verified",
    },
    {
      id: "node-remedial",
      courseTitle: "Remedial Module: React useEffect Dependency & Caching",
      targetSkill: "Cache Invalidation & Side Effects",
      isCompleted: false,
      isCurrent: true,
      isLocked: false,
      practicalPercent: 70,
      theoreticalPercent: 30,
      remedialReason: "Dynamic Remedial Injection: Last Quiz Score 58% (< 70% passing threshold)",
    },
    {
      id: "node-2",
      courseTitle: "Fullstack Route Handlers & Webhooks",
      targetSkill: "HMAC Cryptography & Native Web APIs",
      isCompleted: false,
      isCurrent: false,
      isLocked: false,
      practicalPercent: 85,
      theoreticalPercent: 15,
      milestoneBadge: "🎯 Milestone: Build Automated Stripe E-Commerce Webhook",
    },
    {
      id: "node-3",
      courseTitle: "Distributed Redis Caching & Micro-Services",
      targetSkill: "High-Throughput State Engines",
      isCompleted: false,
      isCurrent: false,
      isLocked: true,
      practicalPercent: 80,
      theoreticalPercent: 20,
      milestoneBadge: "🏆 Capstone Milestone: Deploy Enterprise Multi-Tenant API",
    },
  ]);

  const generateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.info("[AI Roadmap Engine] Re-calculated 80/20 practical-to-theoretical curriculum graph!");
    }, 800);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-gradient-to-br from-white to-[#FAFAFF] p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6B6BFF] to-[#22D3EE] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              🗺️
            </span>
            <h3 className="text-lg font-black text-[#131B2E] tracking-tight">
              MindNova Visual Pathway Graph
            </h3>
          </div>
          <p className="text-xs font-semibold text-[#6B7280] mt-1">
            Dynamic Node-Based Curriculum • Calibrated for <strong className="text-[#5249DE]">80/20 Practical-to-Theoretical Mastery</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={generateRoadmap}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-gradient-to-r from-[#6B6BFF] to-[#4F46E5] text-white text-xs font-black rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-sm cursor-pointer whitespace-nowrap"
        >
          {isGenerating ? "AI Recalibrating Graph..." : "⚡ Recalibrate Pathway"}
        </button>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-10 h-10 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin shadow-md" />
          <p className="text-sm font-bold text-[#3A3B60]">MindNova AI is analyzing your quiz attempts and practical code tests...</p>
        </div>
      ) : (
        <div className="relative pl-8 py-3">
          {/* Main vertical glowing timeline bar */}
          <div className="absolute left-[18px] top-6 bottom-6 w-1.5 bg-gradient-to-b from-emerald-500 via-[#6B6BFF] to-gray-300 rounded-full" />

          <div className="flex flex-col gap-8">
            {roadmap.map((node, idx) => {
              const isRemedial = !!node.remedialReason;

              return (
                <div key={node.id} className="relative flex items-start gap-5 group">
                  {/* Node Icon on Graph */}
                  <div
                    className={`absolute -left-8 w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-125 z-10 ${
                      node.isCompleted
                        ? "bg-emerald-500 text-white shadow-emerald-500/30"
                        : isRemedial
                        ? "bg-amber-500 text-white animate-bounce shadow-amber-500/30"
                        : node.isCurrent
                        ? "bg-[#6B6BFF] text-white shadow-[#6B6BFF]/40"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {node.isCompleted ? "✓" : isRemedial ? "⚠️" : node.isCurrent ? "▶" : "🔒"}
                  </div>

                  {/* Node Card */}
                  <div
                    className={`flex-1 p-6 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                      isRemedial
                        ? "bg-gradient-to-br from-[#FFFBF2] to-[#FFF5DC] border-amber-300"
                        : node.isCurrent
                        ? "bg-gradient-to-br from-[#F5F5FF] to-[#EAEAFE] border-[#6B6BFF]/30 ring-2 ring-[#6B6BFF]/15"
                        : "bg-white border-gray-100"
                    } ${node.isLocked ? "opacity-65 grayscale-[30%]" : ""}`}
                  >
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#5249DE] bg-[#5249DE]/10 px-3 py-1 rounded-full border border-[#5249DE]/20">
                        Skill: {node.targetSkill}
                      </span>

                      {/* 80/20 Ratio Indicator (Section 3.2) */}
                      {node.practicalPercent !== undefined && (
                        <div className="flex items-center gap-1.5 font-mono text-xs font-black px-2.5 py-0.5 rounded-xl bg-gray-900 text-white shadow-xs">
                          <span className="text-emerald-400">⚡ {node.practicalPercent}% Practical</span>
                          <span className="text-gray-500">/</span>
                          <span className="text-cyan-300">{node.theoreticalPercent}% Theory</span>
                        </div>
                      )}
                    </div>

                    {/* Remedial Warning Announcement (Section 3.2) */}
                    {isRemedial && (
                      <div className="mb-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-extrabold flex items-center gap-2">
                        <span>🚨</span>
                        <span>{node.remedialReason}</span>
                      </div>
                    )}

                    <h4 className={`text-lg font-extrabold leading-snug ${node.isLocked ? "text-gray-500" : "text-[#131B2E]"}`}>
                      {node.courseTitle}
                    </h4>

                    {/* Project Build Milestones (Section 3.2) */}
                    {node.milestoneBadge && (
                      <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/80 text-xs font-black text-emerald-950 flex items-center justify-between shadow-xs">
                        <span>{node.milestoneBadge}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white rounded-lg text-emerald-700 shadow-xs">
                          Portfolio Asset
                        </span>
                      </div>
                    )}

                    {node.isLocked && (
                      <div className="mt-3 text-xs font-extrabold text-gray-400 flex items-center gap-1.5">
                        <span>🔒 Complete preceding milestones to unlock cryptographic evaluation</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
