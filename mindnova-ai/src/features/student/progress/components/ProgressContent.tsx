"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, ArrowUpRight, Zap, Lock,
  BookOpen, MessageCircle, Crown, Award, Clock, BarChart3, Target,
  CheckCircle2, LayoutList, LayoutGrid, Flame,
} from "lucide-react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetProgressOverview } from "../api";

export function ProgressContent() {
  const [viewMode, setViewMode] = useState<"linear" | "module">("linear");
  const [activeTab, setActiveTab] = useState<"roadmap" | "analytics">("roadmap");
  const { data, isLoading, isError, refetch } = useGetProgressOverview();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-6 animate-pulse">
        {/* Skeleton Hero Banner */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="h-8 w-1/3 bg-slate-200 rounded-lg"></div>
            <div className="flex gap-2.5 mt-2">
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-5 bg-slate-50 rounded-xl p-4 border border-slate-200 w-full lg:w-72">
            <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </section>

        {/* Skeleton Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <div className="h-9 w-28 bg-slate-200 rounded-lg"></div>
            <div className="h-9 w-28 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
        </div>

        {/* Skeleton Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 h-32 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </div>
              <div className="h-6 w-1/3 bg-slate-200 rounded mt-auto"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Roadmap */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[300px]">
          <div className="h-6 w-1/4 bg-slate-200 rounded mb-8"></div>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-4 pt-1">
                  <div className="h-5 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-20 w-full bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Không thể tải dữ liệu</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          Vui lòng kiểm tra kết nối mạng và thử lại.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-1 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { overview_card, key_metrics, roadmap_modules, ai_insights } = data;
  const pct = overview_card?.completion_percentage || 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-6">

      {/* ── Hero Banner ── */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {overview_card?.course_title || "Khóa học"}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> {overview_card?.next_module_label || "Đang học"}
              </span>
              {overview_card?.status_badge && (
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {overview_card.status_badge}
                </span>
              )}
            </div>
          </div>

          {/* Progress Ring */}
          <div className="shrink-0 flex items-center gap-5 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
                {pct}%
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Hoàn thành khóa học</p>
              <p className="text-xs text-slate-500">
                {overview_card?.completed_lessons || 0} / {overview_card?.total_lessons || 0} bài học
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab + View Toggle ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "roadmap" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Lộ trình học
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "analytics" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Thống kê & AI
          </button>
        </div>

        {activeTab === "roadmap" && (
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("linear")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "linear" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
              title="Dạng danh sách"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("module")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "module" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
              title="Dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── TAB: ROADMAP ── */}
      {activeTab === "roadmap" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {viewMode === "linear" ? (
            /* List View — simple stacked cards, no timeline */
            <div className="flex flex-col gap-4">
              {roadmap_modules?.map((mod, i) => {
                const isCompleted = mod.status === "completed";
                const isActive = mod.status === "active";
                const isLocked = !isCompleted && !isActive;

                return (
                  <div
                    key={mod.id || i}
                    className={`rounded-xl bg-white border p-5 transition-all ${
                      isLocked ? "opacity-50 border-slate-200" : "hover:-translate-y-0.5 hover:shadow-md"
                    } ${isActive ? "border-blue-300 shadow-sm" : "border-slate-200 shadow-sm"}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: step indicator + info */}
                      <div className="flex items-start gap-4">
                        {/* Step circle */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                          isCompleted ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : isActive ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-slate-50 text-slate-400 border border-slate-200"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (i + 1)}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                            {isActive && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                <Zap size={10} /> Đang học
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{mod.subtitle}</p>
                        </div>
                      </div>

                      {/* Right: action */}
                      <div className="shrink-0 sm:ml-4">
                        {isActive ? (
                          <Link href={mod.action_link || "/courses"}>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap">
                              Tiếp tục <ArrowRight size={14} />
                            </button>
                          </Link>
                        ) : isCompleted ? (
                          <Link href={mod.action_link || "/courses"}>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
                              Ôn tập
                            </button>
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
                            <Lock size={12} /> Chưa mở
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar for active module */}
                    {isActive && mod.progress_percentage !== undefined && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4">
                        <span className="text-xs font-medium text-slate-500 shrink-0">Tiến độ</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${mod.progress_percentage}%` }} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 shrink-0">{mod.progress_percentage}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmap_modules?.map((mod, i) => {
                const isCompleted = mod.status === "completed";
                const isActive = mod.status === "active";
                const isLocked = !isCompleted && !isActive;

                return (
                  <div key={mod.id || i} className={`rounded-xl border bg-white p-5 flex flex-col justify-between gap-4 transition-all ${
                    isLocked ? "opacity-50 border-slate-200" : "hover:-translate-y-0.5 hover:shadow-md"
                  } ${isActive ? "border-blue-300 shadow-sm" : "border-slate-200 shadow-sm"}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : isActive ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-slate-50 text-slate-400 border border-slate-200"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : (i + 1)}
                        </div>
                        {isActive && <Zap size={14} className="text-amber-500" />}
                        {isLocked && <Lock size={14} className="text-slate-300" />}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{mod.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{mod.subtitle}</p>
                    </div>

                    {isActive && mod.progress_percentage !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-slate-400">Tiến độ</span>
                          <span className="text-blue-600">{mod.progress_percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mod.progress_percentage}%` }} />
                        </div>
                      </div>
                    )}

                    <div>
                      {isActive ? (
                        <Link href={mod.action_link || "/courses"} className="block">
                          <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                            Tiếp tục ngay
                          </button>
                        </Link>
                      ) : isCompleted ? (
                        <Link href={mod.action_link || "/courses"} className="block">
                          <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                            Ôn tập
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg font-semibold text-sm cursor-not-allowed">
                          Chưa mở khóa
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: ANALYTICS ── */}
      {activeTab === "analytics" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian học</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900">{key_metrics?.study_time?.total_hours || "0h"}</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {key_metrics?.study_time?.weekly_change || "+0h"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm Quiz TB</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900">{key_metrics?.quiz_average?.score || "0%"}</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {key_metrics?.quiz_average?.ranking_tag || "Top 0%"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kỹ năng</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900">{key_metrics?.skills_mastered?.count_text || "0"}</span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                  {key_metrics?.skills_mastered?.tag || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Two Column: Achievements + AI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {ai_insights?.performance_stats && ai_insights.performance_stats.length > 0 && (
              <div className="lg:col-span-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Thành tích</h3>
                  <div className="space-y-2">
                    {ai_insights.performance_stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2.5">
                          {i === 0 ? <Crown size={14} className="text-amber-500" /> :
                           i === 1 ? <Flame size={14} className="text-orange-500" /> :
                           <Award size={14} className="text-blue-500" />}
                          <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={ai_insights?.performance_stats?.length ? "lg:col-span-8" : "lg:col-span-12"}>
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{ai_insights?.title || "Phân tích năng lực"}</h3>
                    <p className="text-xs text-slate-400">{ai_insights?.subtitle || "Dữ liệu tổng hợp theo thời gian thực."}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ai_insights?.recommendations?.map((rec) => {
                    const isHigh = rec.priority_tag?.includes("Khẩn") || rec.priority_tag?.includes("High") || rec.priority_tag?.includes("ưu tiên");
                    return (
                      <div key={rec.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-sm font-semibold text-slate-900">{rec.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                            isHigh ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}>
                            {rec.priority_tag}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-3">{rec.content}</p>
                        {rec.action_url && (
                          <Link href={rec.action_url}>
                            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer">
                              <BookOpen size={13} /> {rec.action_label || "Thực hành ngay"} <ArrowUpRight size={12} />
                            </button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-slate-200 shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Cần hỗ trợ thêm?</p>
                    <p className="text-xs text-slate-500">Truy cập AI Study Plan để hỏi đáp trực tiếp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
