"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
 CalendarIcon,
 ChevronRightIcon,
 DownloadIcon,
 BookIcon,
 TrophyIcon,
 PlayCircleIcon,
 GraduationCapIcon,
 ClockIcon,
 FileTextIcon,
 MessageSquareIcon,
 TrendingUpIcon,
 HistoryIcon
} from "./icons";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetHistoryOverview } from "../api";
import type { HistoryTimelineItem } from "../types";
import toast from "react-hot-toast";

export function LearningHistory() {
 const [filterType, setFilterType] = useState<"all" | "quiz" | "milestone" | "lesson">("all");
 const [isExporting, setIsExporting] = useState(false);
 const [page, setPage] = useState(1);
 const perPage = 10;
 const { data, isLoading, isError, refetch } = useGetHistoryOverview(page, perPage);

 const handleExport = () => {
 setIsExporting(true);
 setTimeout(() => setIsExporting(false), 2000);
 };

 const pagination = data?.pagination;
 const totalPages = pagination?.total_pages ?? 1;
 const hasMore = pagination?.has_more ?? false;

 const goToPage = (newPage: number) => {
 if (newPage >= 1 && newPage <= totalPages) {
 setPage(newPage);
 window.scrollTo({ top: 0, behavior: "smooth" });
 }
 };

  if (isLoading) {
  return (
  <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-[70vh] flex flex-col gap-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div>
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>
    </div>

    {/* Metrics Skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-6 w-1/3 bg-slate-200 rounded mt-auto"></div>
        </div>
      ))}
    </div>

    {/* Timeline Skeleton */}
    <div className="mt-4 space-y-6">
      <div className="h-6 w-32 bg-slate-200 rounded"></div>
      
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  <div className="h-3 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="h-5 w-48 bg-slate-200 rounded"></div>
                <div className="h-4 w-64 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-9 w-28 bg-slate-200 rounded-xl shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
  }

 if (isError || !data) {
 return (
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
 <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-1 shadow-sm border border-blue-100/40">
 ️
 </div>
 <h3 className="text-lg font-bold text-slate-900">Không thể tải dữ liệu lịch sử học tập</h3>
 <p className="text-xs text-slate-500 max-w-md leading-relaxed">
 Đã xảy ra sự cố khi kết nối tới hệ thống lưu trữ nhật ký MindNova AI. Vui lòng kiểm tra kết nối mạng và thử lại sau ít phút.
 </p>
 <button 
 type="button"
 onClick={() => refetch()} 
 className="mt-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-sm"
 >
 Thử tải lại ngay
 </button>
 </div>
 );
 }

 const { overview_card, metrics_row, timeline_groups, total_activities_count } = data;

 // Helper renderer for individual non-compact timeline items
 const renderDetailedItem = (item: HistoryTimelineItem, idx: number) => {
 if (item.type === "quiz" || (item.score_text && !item.shareable)) {
 return (
 <div key={item.id || idx} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-all duration-200 hover:border-slate-200 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-600/15">
 <BookIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-blue-600 bg-slate-50 px-2 py-0.5 rounded-md border border-blue-600/15">{item.badge_text || "Bài đánh giá"}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-xs font-normal text-slate-500">{item.time_text}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-slate-500">{item.subtitle}</p>
 </div>
 </div>

 <div className="flex items-center gap-5 justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
 {item.score_text && (
 <div className="text-right">
 <div className="text-base font-semibold text-slate-900">
 {item.score_text}
 </div>
 {item.score_status && (
 <div className="text-[11px] font-medium text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-slate-900/15 mt-0.5">
 {item.score_status}
 </div>
 )}
 </div>
 )}
 <Link href={item.action_url || "/practice/quiz/result"} className="text-decoration-none shrink-0">
 <button type="button" className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-600 font-medium text-xs hover:bg-slate-50 hover:border-blue-600/25 transition-all flex items-center gap-1 shadow-2xs cursor-pointer">
 <span>{item.action_label || "Xem kết quả"}</span>
 <ChevronRightIcon className="w-4 h-4" />
 </button>
 </Link>
 </div>
 </div>
 );
 }

 if (item.type === "milestone" && item.shareable) {
 return (
 <div key={item.id || idx} className=" from-white via-amber-50/40 to-amber-50/50 border border-amber-500/25 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-all duration-200 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/25">
 <TrophyIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-600/15">{item.badge_text || "Cột mốc mới"}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-xs font-normal text-slate-500">{item.time_text}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-slate-500">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-amber-500/20">
 <button
 type="button"
 onClick={() => toast.success(" Đã sao chép liên kết chứng nhận huy hiệu để chia sẻ với bạn bè!")}
 className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-200/60 border border-amber-500/30 text-amber-600 rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
 >
 <span>{item.share_label || "Chia sẻ thành tích"}</span>
 </button>
 </div>
 </div>
 );
 }

 if (item.type === "milestone" || item.duration_tag) {
 return (
 <div key={item.id || idx} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-all duration-200 hover:border-blue-600/30 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-600/20">
 <GraduationCapIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-blue-600 bg-slate-50 px-2 py-0.5 rounded-md border border-blue-600/15">{item.badge_text || "Đăng ký khoá mới"}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-xs font-normal text-slate-500">{item.time_text}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-slate-500">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
 {item.duration_tag && (
 <span className="flex items-center gap-1.5 text-xs font-normal text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
 <ClockIcon className="w-4 h-4 text-blue-600" />
 <span>{item.duration_tag}</span>
 </span>
 )}
 <Link href={item.action_url || "/courses"} className="text-decoration-none shrink-0">
 <button type="button" className="px-4 py-2 rounded-xl bg-slate-50 text-blue-600 font-medium text-xs hover:bg-indigo-100 border border-blue-600/20 transition-colors shadow-2xs cursor-pointer">
 {item.action_label || "Vào học ngay"}
 </button>
 </Link>
 </div>
 </div>
 );
 }

 // Default lesson progress card
 return (
 <div key={item.id || idx} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-all duration-200 hover:border-slate-900/30 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-emerald-50 text-slate-900 flex items-center justify-center shrink-0 border border-slate-900/20">
 <PlayCircleIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-slate-900/15">{item.badge_text || "Bài học hoàn tất"}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-xs font-normal text-slate-500">{item.time_text}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-slate-500">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 sm:w-44 flex flex-col sm:items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
 <div className="flex items-center justify-between w-full text-xs">
 <span className="text-slate-500 font-normal">Tiến độ học:</span>
 <span className="text-slate-900 font-medium">{item.progress_label || "100% Hoàn thành"}</span>
 </div>
 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
 <div 
 className="h-full bg-slate-900 rounded-full" 
 style={{ width: `${item.progress_percentage ?? 100}%` }}
 />
 </div>
 </div>
 </div>
 );
 };

 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-7">
 
 {/* ─── Synchronized Hero Banner matching /courses, /study-plan, /practice & /progress ─── */}
 <section className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)]">
 
 

 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div className="space-y-3 max-w-2xl">
 {/* Breadcrumbs */}
 <div className="flex items-center gap-2 text-xs font-normal text-slate-500">
 <Link href="/courses" className="hover:text-blue-600 transition-colors text-decoration-none font-medium">
 Khoá học của tôi
 </Link>
 <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />
 <span className="text-slate-900 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-slate-900/20">
 Lịch sử học tập
 </span>
 </div>

 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-medium text-blue-600 shadow-2xs">
 Nhật ký hoạt động hệ thống AI • 24/7
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
 Lịch sử học tập: {" "}
 <span className="text-blue-600 drop-shadow-2xs font-bold">
 Hành trình Trí tuệ AI 
 </span>
 </h1>

 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Theo dõi trọn vẹn các mốc học tập, kết quả kiểm tra và thành tích trên hành trình rèn luyện kỹ năng công nghệ cùng <span className="text-blue-600 font-medium">Gia sư Nova</span>.
 </p>
 </div>

 {/* Interactive Activity Mastery Widget */}
 <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-xl p-5 border border-slate-200 flex flex-col justify-center min-w-[320px] sm:min-w-[370px] shadow-2xs hover:border-slate-200 transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">Tổng quan hoạt động </span>
 <span className="text-[11px] font-medium text-slate-900 bg-slate-50/70 px-2.5 py-0.5 rounded-full border border-slate-900">
 {overview_card?.status_badge || "Chưa hoạt động"}
 </span>
 </div>

 <div className="text-2xl font-semibold text-slate-900 my-1 flex items-baseline justify-between gap-6">
 <div>
 <span className="text-blue-600 font-semibold text-2xl sm:text-3xl">
 {overview_card?.total_activities ?? total_activities_count ?? 0}
 </span>
 <span className="text-xs font-normal text-slate-500 ml-1.5">lượt tương tác</span>
 </div>
 <span className="text-xs font-medium text-slate-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-slate-900">
 {overview_card?.status_tag === "Active" ? "Đang hoạt động" : "Tạm nghỉ"}
 </span>
 </div>

 <div className="w-full h-2 bg-slate-200 rounded-full mt-2.5 overflow-hidden p-0.5 border border-slate-200">
 <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${metrics_row?.ai_proficiency?.percentage ?? 0}%` }} />
 </div>

 <p className="text-xs font-medium text-blue-600 mt-3 flex items-center justify-between">
 <span>{overview_card?.streak_label || "Chưa có chuỗi chuyên cần"}</span>
 <span className="text-blue-600 font-medium">{overview_card?.next_level_label || "Level 1"}</span>
 </p>
 </div>
 </div>
 </section>

 {/* ─── 4 Key Metrics Row (Eye-Soothing Typography Guarantee - No Line Wrap) ─── */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
 
 {/* Total Lessons */}
 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-blue-600/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-slate-500">Tổng số bài học</span>
 <div className="w-9 h-9 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-600/15 shadow-2xs">
 <BookIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-slate-900 tracking-normal">
 {metrics_row?.total_lessons?.value ?? 0} <span className="text-xs font-normal text-slate-500 ml-0.5">{metrics_row?.total_lessons?.unit || "bài"}</span>
 </span>
 {metrics_row?.total_lessons?.change_tag && (
 <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
 {metrics_row.total_lessons.change_tag}
 </span>
 )}
 </div>
 </div>

 {/* Avg Quiz Score */}
 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-slate-900/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-slate-500">Điểm Quiz trung bình</span>
 <div className="w-9 h-9 rounded-xl bg-emerald-50 text-slate-900 flex items-center justify-center shrink-0 border border-slate-900/15 shadow-2xs">
 <TrophyIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-slate-900 tracking-normal">
 {metrics_row?.quiz_average?.value || "—"}
 </span>
 <span className="text-[11px] font-medium text-sky-600 bg-white px-2.5 py-0.5 rounded-full border border-sky-600/15 flex items-center gap-1">
 <TrendingUpIcon className="w-3 h-3" />
 <span>{metrics_row?.quiz_average?.progress_tag || "Chưa làm bài"}</span>
 </span>
 </div>
 </div>

 {/* Study Hours */}
 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-sky-600/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-slate-500">Thời gian rèn luyện</span>
 <div className="w-9 h-9 rounded-xl bg-white text-sky-600 flex items-center justify-center shrink-0 border border-sky-600/15 shadow-2xs">
 <ClockIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-slate-900 whitespace-nowrap tracking-normal">
 {metrics_row?.study_hours?.value ?? 0} <span className="text-sm font-normal text-slate-500">{metrics_row?.study_hours?.unit || "giờ"}</span>
 </span>
 <span className="text-[11px] font-normal text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap">
 {metrics_row?.study_hours?.tag || "Theo bài đã học"}
 </span>
 </div>
 </div>

 {/* AI Proficiency */}
 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-blue-600/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-slate-500">Cấp độ học tập</span>
 {metrics_row?.ai_proficiency?.ranking_tag && (
 <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
 {metrics_row.ai_proficiency.ranking_tag}
 </span>
 )}
 </div>
 <div className="space-y-2 pt-0.5">
 <div className="flex items-center justify-between text-sm font-semibold text-blue-600">
 <span>{metrics_row?.ai_proficiency?.level_label || "Level 1"}</span>
 <span className="text-xs font-normal text-slate-500">{metrics_row?.ai_proficiency?.xp_text || "0 / 100 XP"}</span>
 </div>
 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
 <div 
 className="h-full bg-blue-600 rounded-full" 
 style={{ width: `${metrics_row?.ai_proficiency?.percentage ?? 0}%` }}
 />
 </div>
 </div>
 </div>

 </div>

 {/* ─── Interactive Filter Bar & Export Actions ─── */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 sm:py-4 rounded-xl border border-slate-200 shadow-2xs">
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-xs font-medium text-slate-500 mr-1.5 flex items-center gap-1.5">
 <HistoryIcon className="w-4 h-4 text-blue-600" />
 <span>Lọc theo hoạt động:</span>
 </span>

 <button
 type="button"
 onClick={() => setFilterType("all")}
 className={`group whitespace-nowrap px-4 py-2 text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 rounded-lg border cursor-pointer ${
 filterType === "all"
 ? "bg-blue-50 text-blue-600 font-semibold border-blue-200 shadow-sm"
 : "bg-white text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 border-slate-200"
 }`}
 >
 Tất cả
 </button>

 <button
 type="button"
 onClick={() => setFilterType("quiz")}
 className={`group whitespace-nowrap px-4 py-2 text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 rounded-lg border cursor-pointer ${
 filterType === "quiz"
 ? "bg-blue-50 text-blue-600 font-semibold border-blue-200 shadow-sm"
 : "bg-white text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 border-slate-200"
 }`}
 >
 Bài đánh giá (Quiz)
 </button>

 <button
 type="button"
 onClick={() => setFilterType("milestone")}
 className={`group whitespace-nowrap px-4 py-2 text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 rounded-lg border cursor-pointer ${
 filterType === "milestone"
 ? "bg-blue-50 text-blue-600 font-semibold border-blue-200 shadow-sm"
 : "bg-white text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 border-slate-200"
 }`}
 >
 Cột mốc thành tựu
 </button>

 <button
 type="button"
 onClick={() => setFilterType("lesson")}
 className={`group whitespace-nowrap px-4 py-2 text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 rounded-lg border cursor-pointer ${
 filterType === "lesson"
 ? "bg-blue-50 text-blue-600 font-semibold border-blue-200 shadow-sm"
 : "bg-white text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 border-slate-200"
 }`}
 >
 Bài học hoàn tất
 </button>
 </div>

 <button
 type="button"
 onClick={handleExport}
 disabled={isExporting}
 className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium shadow-2xs transition-all duration-200 cursor-pointer shrink-0 ${
 isExporting
 ? "bg-slate-900 text-white"
 : "bg-white border border-blue-600/25 text-blue-600 hover:bg-slate-50"
 }`}
 >
 <DownloadIcon className={`w-3.5 h-3.5 ${isExporting ? "animate-bounce" : ""}`} />
 <span>{isExporting ? "Đang xuất file PDF..." : "Xuất báo cáo cá nhân"}</span>
 </button>
 </div>

 {/* ─── Timeline Activity Area (Dynamic from API) ─── */}
 <div className="space-y-8">
 
 {timeline_groups && timeline_groups.map((group, groupIndex) => {
 // Filter items based on active interactive button
 const filteredItems = group.items.filter((item) => filterType === "all" || item.type === filterType);

 // Skip section if empty under current filter
 if (filteredItems.length === 0) return null;

 return (
 <div key={group.id || groupIndex} className="space-y-3.5">
 <div className="flex items-center gap-3 pl-1">
 <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
 group.icon_type === "calendar" ? "bg-slate-50 text-blue-600 border border-blue-600/15" :
 group.icon_type === "calendar_light" ? "border border-slate-200 bg-slate-50 text-slate-500" :
 "border border-slate-200 bg-slate-50 text-slate-500"
 }`}>
 {group.icon_type === "history" ? <HistoryIcon className="w-4 h-4 text-slate-500" /> : <CalendarIcon className="w-4 h-4" />}
 </div>
 <div>
 <h2 className="text-sm sm:text-base font-semibold text-slate-900">{group.section_title}</h2>
 <p className="text-xs font-normal text-slate-500">{group.subtitle}</p>
 </div>
 </div>

 <div className="flex flex-col gap-3.5 pl-3 sm:pl-5 border-l-2 border-slate-200 ml-4">
 {group.is_compact ? (
 // Render compact items (weekly activities / reading logs)
 filteredItems.map((item, itemIdx) => (
 <div key={item.id || itemIdx} className="bg-white/90 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:bg-white transition-all duration-150 shadow-2xs hover:border-slate-200">
 <div className="flex items-center gap-3.5 min-w-0">
 <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
 {item.icon_type === "comment" ? <MessageSquareIcon className="w-4.5 h-4.5" /> : <FileTextIcon className="w-4.5 h-4.5" />}
 </div>
 <div className="min-w-0">
 <h4 className="text-xs sm:text-sm font-medium text-slate-900 truncate hover:text-blue-600 transition-colors">{item.title}</h4>
 <p className="text-[11px] font-normal text-slate-500">{item.date_time_text || "Trong tuần"}</p>
 </div>
 </div>
 <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg shrink-0 border ${
 item.badge_color === "indigo" ? "text-blue-600 bg-slate-50 border-blue-600/15" : "text-slate-900 bg-emerald-50 border-slate-900/15"
 }`}>
 {item.status_badge || "Đã lưu trữ"}
 </span>
 </div>
 ))
 ) : (
 // Render detailed cards
 filteredItems.map((item, itemIdx) => renderDetailedItem(item, itemIdx))
 )}
 </div>
 </div>
 );
 })}

 {/* Footer Pagination */}
 {totalPages > 1 && (
 <div className="pt-2 flex flex-col items-center justify-center pb-6 gap-3">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => goToPage(page - 1)}
 disabled={page <= 1}
 className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-blue-600 hover:bg-slate-50 hover:border-blue-600/30 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 ← Trước
 </button>

 <div className="flex items-center gap-1">
 {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
 <button
 key={pageNum}
 type="button"
 onClick={() => goToPage(pageNum)}
 className={`w-9 h-9 rounded-xl text-xs font-medium transition-all cursor-pointer ${
 pageNum === page
 ? "bg-blue-600 text-white shadow-2xs"
 : "bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 hover:border-blue-600/30"
 }`}
 >
 {pageNum}
 </button>
 ))}
 </div>

 <button
 type="button"
 onClick={() => goToPage(page + 1)}
 disabled={page >= totalPages}
 className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-blue-600 hover:bg-slate-50 hover:border-blue-600/30 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Sau →
 </button>
 </div>

 <p className="text-[11px] font-normal text-slate-500">
 Trang {page} / {totalPages} • Tổng {pagination?.total_items ?? total_activities_count} hoạt động
 </p>
 </div>
 )}

 {totalPages <= 1 && (
 <div className="pt-2 flex flex-col items-center justify-center pb-6 gap-2">
 <p className="text-[11px] font-normal text-slate-500">
 Đã hiển thị tất cả {total_activities_count} hoạt động rèn luyện
 </p>
 </div>
 )}

 </div>
 </div>
 );
}
