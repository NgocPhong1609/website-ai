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
      milestoneBadge: "🏁 Đã xác thực nền tảng cốt lõi",
    },
    {
      id: "node-remedial",
      courseTitle: "Module Bổ trợ: Quản lý bộ nhớ đệm Cache Invalidation & Side Effects",
      targetSkill: "Tối ưu hóa hiệu năng React",
      isCompleted: false,
      isCurrent: true,
      isLocked: false,
      practicalPercent: 70,
      theoreticalPercent: 30,
      remedialReason: "Tự động Bổ trợ: Điểm bài kiểm tra gần nhất đạt 58% (< 70% ngưỡng yêu cầu)",
    },
    {
      id: "node-2",
      courseTitle: "Fullstack Route Handlers & Webhooks Security",
      targetSkill: "HMAC Cryptography & Native Web APIs",
      isCompleted: false,
      isCurrent: false,
      isLocked: false,
      practicalPercent: 85,
      theoreticalPercent: 15,
      milestoneBadge: "🎯 Cột mốc: Triển khai thành công Cổng thanh toán Stripe Webhook",
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
      milestoneBadge: "🏆 Đồ án tốt nghiệp: Triển khai hệ thống Enterprise Multi-Tenant API",
    },
  ]);

  const generateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.info("[AI Roadmap Engine] Tái tạo thành công biểu đồ lộ trình chuẩn 80/20!");
    }, 800);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
              🗺️
            </span>
            <h3 className="text-base font-black text-gray-900 tracking-tight">
              Biểu đồ Lộ trình Kiến thức Động MindNova
            </h3>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Lộ trình học liệu cá nhân hóa • Chuẩn hóa <strong className="text-[#4F46E5]">80% Thực chiến / 20% Lý thuyết</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={generateRoadmap}
          disabled={isGenerating}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl transition-all disabled:opacity-50 shadow-2xs cursor-pointer whitespace-nowrap active:scale-[0.99]"
        >
          {isGenerating ? "AI Đang tính toán lộ trình..." : "⚡ Tái lập trình Lộ trình AI"}
        </button>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin shadow-sm" />
          <p className="text-xs font-bold text-gray-700">Trí tuệ nhân tạo MindNova đang phân tích lịch sử kiểm tra và bài tập mã nguồn của bạn...</p>
        </div>
      ) : (
        <div className="relative pl-8 py-3">
          {/* Main vertical timeline bar */}
          <div className="absolute left-[18px] top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-500 via-[#4F46E5] to-gray-200 rounded-full" />

          <div className="flex flex-col gap-6">
            {roadmap.map((node) => {
              const isRemedial = !!node.remedialReason;

              return (
                <div key={node.id} className="relative flex items-start gap-5 group">
                  {/* Node Icon on Graph */}
                  <div
                    className={`absolute -left-8 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-2xs transition-transform group-hover:scale-110 z-10 ${
                      node.isCompleted
                        ? "bg-emerald-600 text-white"
                        : isRemedial
                        ? "bg-amber-500 text-white animate-pulse"
                        : node.isCurrent
                        ? "bg-[#4F46E5] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {node.isCompleted ? "✓" : isRemedial ? "⚠️" : node.isCurrent ? "▶" : "🔒"}
                  </div>

                  {/* Node Card */}
                  <div
                    className={`flex-1 p-5 rounded-2xl border transition-all duration-300 shadow-2xs ${
                      isRemedial
                        ? "bg-amber-50/50 border-amber-200"
                        : node.isCurrent
                        ? "bg-indigo-50/40 border-indigo-200"
                        : "bg-white border-gray-200"
                    } ${node.isLocked ? "opacity-60 bg-gray-50" : ""}`}
                  >
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black tracking-wider uppercase text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                        Kỹ năng: {node.targetSkill}
                      </span>

                      {/* 80/20 Ratio Indicator */}
                      {node.practicalPercent !== undefined && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-gray-900 text-white shadow-2xs">
                          <span className="text-emerald-400">⚡ {node.practicalPercent}% Thực hành</span>
                          <span className="text-gray-500">/</span>
                          <span className="text-cyan-300">{node.theoreticalPercent}% Lý thuyết</span>
                        </div>
                      )}
                    </div>

                    {/* Remedial Warning Announcement */}
                    {isRemedial && (
                      <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center gap-2">
                        <span>🚨</span>
                        <span>{node.remedialReason}</span>
                      </div>
                    )}

                    <h4 className={`text-sm font-black leading-snug ${node.isLocked ? "text-gray-500" : "text-gray-900"}`}>
                      {node.courseTitle}
                    </h4>

                    {/* Project Build Milestones */}
                    {node.milestoneBadge && (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center justify-between shadow-2xs">
                        <span>{node.milestoneBadge}</span>
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-white rounded-md text-emerald-700 shadow-2xs border border-emerald-100">
                          Tài sản Portfolio
                        </span>
                      </div>
                    )}

                    {node.isLocked && (
                      <div className="mt-2.5 text-xs font-bold text-gray-400 flex items-center gap-1.5">
                        <span>🔒 Hoàn tất các chặng trước để mở khóa quy trình xác thực bài kiểm tra</span>
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
