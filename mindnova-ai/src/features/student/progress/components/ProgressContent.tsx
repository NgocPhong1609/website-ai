"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SparklesIcon, ChevronRightIcon } from "./icons";
import { Flame, ArrowRight, Zap, Lock, BookOpen, MessageCircle } from "lucide-react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetProgressOverview } from "../api";

export function ProgressContent() {
  const [viewMode, setViewMode] = useState<"linear" | "module">("linear");
  const [activeTab, setActiveTab] = useState<"roadmap" | "analytics">("roadmap");
  const { data, isLoading, isError, refetch } = useGetProgressOverview();

  if (isLoading) {
    return (
      <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Đang đồng bộ tiến trình học tập từ Gia sư Trí tuệ Nhân tạo Nova..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#C0392B] flex items-center justify-center text-2xl mb-1 shadow-sm border border-[#FCA5A5]/40">
          
        </div>
        <h3 className="text-lg font-bold text-[#2C3039]">Không thể tải dữ liệu tiến trình học tập</h3>
        <p className="text-xs text-[#8A8478] max-w-md leading-relaxed">
          Đã có trở ngại khi kết nối tới máy chủ AI MindNova. Vui lòng kiểm tra lại đường truyền mạng hoặc khởi tạo lại phiên kết nối.
        </p>
        <button 
          type="button"
          onClick={() => refetch()} 
          className="mt-2 px-6 py-2.5 bg-[#C0392B] text-white text-xs font-semibold rounded-xl hover:bg-[#C0392B] transition-all cursor-pointer shadow-sm"
        >
           Thử tải lại ngay
        </button>
      </div>
    );
  }

  const { overview_card, key_metrics, roadmap_modules, ai_insights } = data;

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-[85vh] flex flex-col gap-8 bg-white">
      
      {/* Header & Tabs Navigation */}
      <div className="space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#2C3039]">
            Tiến trình Học tập: <span className="text-[#C0392B]">{overview_card?.course_title || "Khóa học AI"}</span>
          </h1>
          <p className="text-sm text-[#8A8478] mt-2">
            Được giám sát và cá nhân hóa bởi Gia sư Trí tuệ Nhân tạo Nova.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 border-b border-[#E8E2D9]">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "roadmap"
                ? "text-[#C0392B] border-b-2 border-[#C0392B]"
                : "text-[#8A8478] hover:text-[#2C3039]"
            }`}
          >
            Bản đồ Lộ trình
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "analytics"
                ? "text-[#C0392B] border-b-2 border-[#C0392B]"
                : "text-[#8A8478] hover:text-[#2C3039]"
            }`}
          >
            Báo cáo Thống kê & AI
          </button>
        </div>
      </div>

      {/* TAB CONTENT: ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 bg-[#FEFCF9] border border-[#E8E2D9] px-4 py-2 rounded-xl">
              <span className="text-xs font-semibold text-[#8A8478]">Chế độ xem:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("linear")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "linear"
                      ? "bg-[#C0392B] text-white"
                      : "text-[#8A8478] hover:bg-[#F5F0E8] hover:text-[#2C3039]"
                  }`}
                >
                  Tuyến tính
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("module")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "module"
                      ? "bg-[#C0392B] text-white"
                      : "text-[#8A8478] hover:bg-[#F5F0E8] hover:text-[#2C3039]"
                  }`}
                >
                  Dạng Thẻ
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[11px] font-semibold text-[#C0392B] bg-[#FADBD8]/40 px-3 py-1.5 rounded-full border border-[#C0392B]/20 inline-block">
                Tiến độ khóa học: {overview_card?.completion_percentage || 0}%
              </p>
            </div>
          </div>

          {viewMode === "linear" ? (
            <div className="relative pl-6 py-2 ml-4 md:ml-12 border-l-2 border-[#E8E2D9]">
              <div className="flex flex-col gap-10">
                {roadmap_modules && roadmap_modules.map((mod, i) => {
                  const isCompleted = mod.status === "completed";
                  const isActive = mod.status === "active";
                  const isLocked = mod.status === "locked" || (!isCompleted && !isActive);

                  return (
                    <div key={mod.id || i} className={`relative flex flex-col gap-3 transition-opacity ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
                      
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[35px] top-1 w-5 h-5 rounded-full ring-4 ring-white shrink-0 ${
                        isCompleted ? "bg-[#27AE60]" : isActive ? "bg-[#C0392B] shadow-[0_0_12px_rgba(192,57,43,0.4)]" : "bg-[#E8E2D9]"
                      }`} />

                      <div className={`p-6 rounded-2xl bg-white border transition-colors ${
                        isActive ? "border-[#C0392B] shadow-sm" : isCompleted ? "border-[#E8E2D9] hover:border-[#B8B0A3]" : "border-[#E8E2D9]"
                      }`}>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                                isActive ? "bg-[#FADBD8] text-[#C0392B] border-[#C0392B]/20" : isCompleted ? "bg-[#E8F8F0] text-[#27AE60] border-[#27AE60]/20" : "bg-[#F5F0E8] text-[#8A8478] border-[#E8E2D9]"
                              }`}>
                                {mod.module_number}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-bold text-[#D97706] flex items-center gap-1 bg-[#FFF8EB] px-2 py-0.5 rounded-md border border-[#D97706]/20">
                                  <Zap size={12} /> Đang học
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold font-serif text-[#2C3039]">{mod.title}</h3>
                            <p className="text-sm text-[#8A8478] leading-relaxed max-w-xl">{mod.subtitle}</p>
                          </div>
                          
                          <div className="shrink-0 flex items-center justify-end sm:items-start">
                            {isActive ? (
                              <Link href={mod.action_link || "/courses"} className="text-decoration-none">
                                <button className="px-5 py-2.5 bg-[#C0392B] text-white rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
                                  Tiếp tục học <ArrowRight size={14} />
                                </button>
                              </Link>
                            ) : isCompleted ? (
                              <Link href={mod.action_link || "/courses"} className="text-decoration-none">
                                <button className="px-4 py-2 bg-[#FEFCF9] border border-[#E8E2D9] text-[#2C3039] rounded-lg font-bold text-xs hover:border-[#B8B0A3] transition-colors cursor-pointer">
                                  Ôn tập
                                </button>
                              </Link>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#8A8478] bg-[#F5F0E8] px-3 py-1.5 rounded-lg border border-[#E8E2D9]">
                                <Lock size={12} /> Chưa mở
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div className="mt-5 pt-4 border-t border-[#E8E2D9] space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-[#8A8478]">Tiến độ Module</span>
                              <span className="text-[#C0392B]">{mod.progress_text || `${mod.progress_percentage || 0}%`}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#F5F0E8] rounded-full overflow-hidden">
                              <div className="h-full bg-[#C0392B] rounded-full" style={{ width: `${mod.progress_percentage || 0}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {roadmap_modules && roadmap_modules.map((mod, i) => {
                const isCompleted = mod.status === "completed";
                const isActive = mod.status === "active";
                const isLocked = !isCompleted && !isActive;

                return (
                  <div key={mod.id || i} className={`card-editorial p-6 flex flex-col justify-between gap-5 transition-all ${
                    isActive ? "border-[#C0392B] shadow-sm bg-white" : isLocked ? "opacity-70 bg-[#FEFCF9]" : "bg-white hover:border-[#B8B0A3]"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                          isActive ? "bg-[#FADBD8] text-[#C0392B] border-[#C0392B]/20" : isCompleted ? "bg-[#E8F8F0] text-[#27AE60] border-[#27AE60]/20" : "bg-[#F5F0E8] text-[#8A8478] border-[#E8E2D9]"
                        }`}>
                          {mod.module_number}
                        </span>
                        {isActive && <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF8EB] px-2 py-0.5 rounded-md border border-[#D97706]/20 flex items-center gap-1"><Zap size={10} />Đang học</span>}
                        {isLocked && <Lock size={14} className="text-[#B8B0A3]" />}
                      </div>
                      <h3 className="text-lg font-bold font-serif text-[#2C3039] leading-tight">{mod.title}</h3>
                      <p className="text-sm text-[#8A8478] line-clamp-2 leading-relaxed">{mod.subtitle}</p>
                    </div>

                    {isActive && (
                      <div className="space-y-2 pt-4 border-t border-[#E8E2D9]">
                        <div className="flex justify-between text-[11px] font-semibold text-[#8A8478]">
                          <span>Tiến độ</span>
                          <span className="text-[#C0392B]">{mod.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-[#F5F0E8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C0392B] rounded-full" style={{ width: `${mod.progress_percentage || 0}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      {isActive ? (
                        <Link href={mod.action_link || "/courses"} className="block text-decoration-none">
                          <button className="w-full py-3 bg-[#C0392B] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            Tiếp tục ngay
                          </button>
                        </Link>
                      ) : isCompleted ? (
                        <Link href={mod.action_link || "/courses"} className="block text-decoration-none">
                          <button className="w-full py-2.5 bg-white border border-[#E8E2D9] text-[#2C3039] rounded-lg font-bold text-sm hover:border-[#B8B0A3] transition-colors cursor-pointer">
                            Ôn tập
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="w-full py-2.5 bg-[#F5F0E8] border border-[#E8E2D9] text-[#8A8478] rounded-lg font-bold text-sm cursor-not-allowed">
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

      {/* TAB CONTENT: ANALYTICS & INSIGHTS */}
      {activeTab === "analytics" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1200px] mx-auto">
          
          {/* Metrics Column (Left - 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="text-xl font-bold font-serif text-[#2C3039]">Thống kê Kết quả</h2>
            
            <div className="card-editorial p-6 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold text-[#8A8478] uppercase tracking-wider">Tổng thời gian học</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-[#2C3039]">{key_metrics?.study_time?.total_hours || "0h"}</span>
                <span className="text-[11px] font-bold text-[#C0392B] bg-[#FADBD8]/40 px-2.5 py-1 rounded-md border border-[#C0392B]/20 flex items-center gap-1">
                  <Zap size={12} /> {key_metrics?.study_time?.weekly_change || "+0h tuần này"}
                </span>
              </div>
            </div>

            <div className="card-editorial p-6 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold text-[#8A8478] uppercase tracking-wider">Điểm trung bình Quiz</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-[#2C3039]">{key_metrics?.quiz_average?.score || "0%"}</span>
                <span className="text-[11px] font-bold text-[#27AE60] bg-[#E8F8F0] px-2.5 py-1 rounded-md border border-[#27AE60]/20">
                  {key_metrics?.quiz_average?.ranking_tag || "Top 0%"}
                </span>
              </div>
            </div>

            <div className="card-editorial p-6 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold text-[#8A8478] uppercase tracking-wider">Kỹ năng thành thạo</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-bold text-[#2C3039]">{key_metrics?.skills_mastered?.count_text || "0"}</span>
                <span className="text-[11px] font-bold text-[#2C3039] bg-[#E8E2D9] px-2.5 py-1 rounded-md">
                  {key_metrics?.skills_mastered?.tag || "N/A"}
                </span>
              </div>
            </div>

            <div className="card-editorial p-6 mt-2 bg-white">
              <h3 className="text-sm font-bold text-[#2C3039] mb-4">Bảng vàng Thành tích</h3>
              <div className="space-y-3">
                {ai_insights?.performance_stats?.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#FEFCF9] border border-[#E8E2D9]">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{stat.icon || "⭐"}</span>
                      <span className="text-sm font-semibold text-[#2C3039]">{stat.label}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8A8478] border border-[#E8E2D9]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights Column (Right - 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-xl font-bold font-serif text-[#2C3039] flex items-center gap-2">
              <SparklesIcon className="text-[#C0392B] w-6 h-6" /> Báo cáo từ Gia sư AI
            </h2>

            <div className="card-editorial p-8 bg-[#FEFCF9] border-[#E8E2D9]">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2C3039] mb-1">{ai_insights?.title || "Phân tích Năng lực"}</h3>
                <p className="text-sm text-[#8A8478]">{ai_insights?.subtitle || "Dữ liệu được tổng hợp theo thời gian thực."}</p>
              </div>

              <div className="space-y-5">
                {ai_insights?.recommendations?.map((rec) => (
                  <div key={rec.id} className="p-5 rounded-xl bg-white border border-[#E8E2D9] shadow-sm hover:border-[#B8B0A3] transition-colors relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${rec.priority_tag.includes('Khẩn') || rec.priority_tag.includes('High') ? 'bg-[#C0392B]' : 'bg-[#27AE60]'}`} />
                    <div className="pl-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-[#2C3039]">{rec.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rec.priority_tag.includes('Khẩn') || rec.priority_tag.includes('High') ? 'bg-[#FADBD8] text-[#C0392B] border-[#C0392B]/20' : 'bg-[#E8F8F0] text-[#27AE60] border-[#27AE60]/20'}`}>
                          {rec.priority_tag}
                        </span>
                      </div>
                      <p className="text-sm text-[#8A8478] leading-relaxed mb-4">
                        {rec.content}
                      </p>
                      {rec.action_url && (
                        <Link href={rec.action_url} className="text-decoration-none">
                          <button className="text-xs font-bold text-[#C0392B] hover:underline flex items-center gap-1.5 cursor-pointer">
                            <BookOpen size={14} /> {rec.action_label || "Thực hành ngay"} <ArrowRight size={14} />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#C0392B] shadow-sm border border-[#E8E2D9]">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3039]">Cần hỏi thêm?</h4>
                    <p className="text-xs text-[#8A8478]">Nhắn tin với Gia sư Nova ở góc phải.</p>
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
