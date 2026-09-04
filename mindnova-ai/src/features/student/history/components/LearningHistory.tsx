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
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[70vh] flex items-center justify-center">
 <Loader size="lg" text="Đang đồng bộ nhật ký rèn luyện và thành quả từ Gia sư AI Nova..." />
 </div>
 );
 }

 if (isError || !data) {
 return (
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
 <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#C0392B] flex items-center justify-center text-2xl mb-1 shadow-sm border border-[#FCA5A5]/40">
 ️
 </div>
 <h3 className="text-lg font-bold text-[#2C3039]">Không thể tải dữ liệu lịch sử học tập</h3>
 <p className="text-xs text-[#8A8478] max-w-md leading-relaxed">
 Đã xảy ra sự cố khi kết nối tới hệ thống lưu trữ nhật ký MindNova AI. Vui lòng kiểm tra kết nối mạng và thử lại sau ít phút.
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

 const { overview_card, metrics_row, timeline_groups, total_activities_count } = data;

 // Helper renderer for individual non-compact timeline items
 const renderDetailedItem = (item: HistoryTimelineItem, idx: number) => {
 if (item.type === "quiz" || (item.score_text && !item.shareable)) {
 return (
 <div key={item.id || idx} className="bg-white border border-[#E8E2D9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-all duration-200 hover:border-[#E8E2D9] group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#C0392B] flex items-center justify-center shrink-0 border border-[#C0392B]/15">
 <BookIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-[#C0392B] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#C0392B]/15">{item.badge_text || "Bài đánh giá"}</span>
 <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
 <span className="text-xs font-normal text-[#8A8478]">{item.time_text || "10:45 AM"}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-[#2C3039] group-hover:text-[#C0392B] transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-[#8A8478]">{item.subtitle}</p>
 </div>
 </div>

 <div className="flex items-center gap-5 justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-0 border-[#F0F0F8]">
 {item.score_text && (
 <div className="text-right">
 <div className="text-base font-semibold text-[#2C3039]">
 {item.score_text}
 </div>
 {item.score_status && (
 <div className="text-[11px] font-medium text-[#2C3039] bg-[#EAF8F5] px-2 py-0.5 rounded-full inline-block border border-[#2C3039]/15 mt-0.5">
 {item.score_status}
 </div>
 )}
 </div>
 )}
 <Link href={item.action_url || "/practice/quiz/result"} className="text-decoration-none shrink-0">
 <button type="button" className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9] text-[#C0392B] font-medium text-xs hover:bg-[#FAF7F2] hover:border-[#C0392B]/25 transition-all flex items-center gap-1 shadow-2xs cursor-pointer">
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
 <div key={item.id || idx} className=" from-white via-[#FFF9ED]/40 to-[#FFF3DF]/50 border border-[#F59E0B]/25 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-all duration-200 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-[#FFF3DF] text-[#D97706] flex items-center justify-center shrink-0 border border-[#F59E0B]/25">
 <TrophyIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-[#D97706] bg-[#FFF3DF] px-2 py-0.5 rounded-md border border-[#D97706]/15">{item.badge_text || "Cột mốc mới"}</span>
 <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
 <span className="text-xs font-normal text-[#8A8478]">{item.time_text || "09:15 AM"}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-[#2C3039] group-hover:text-[#D97706] transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-[#8A8478]">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-[#F59E0B]/20">
 <button
 type="button"
 onClick={() => alert(" Đã sao chép liên kết chứng nhận huy hiệu để chia sẻ với bạn bè!")}
 className="w-full sm:w-auto px-4 py-2 bg-[#FFF3DF] hover:bg-[#FDE68A]/60 border border-[#F59E0B]/30 text-[#D97706] rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
 >
 <span>{item.share_label || " Chia sẻ thành tích"}</span>
 </button>
 </div>
 </div>
 );
 }

 if (item.type === "milestone" || item.duration_tag) {
 return (
 <div key={item.id || idx} className="bg-white border border-[#E8E2D9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-all duration-200 hover:border-[#C0392B]/30 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#C0392B] flex items-center justify-center shrink-0 border border-[#C0392B]/20">
 <GraduationCapIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-[#C0392B] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#C0392B]/15">{item.badge_text || "Đăng ký khoá mới"}</span>
 <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
 <span className="text-xs font-normal text-[#8A8478]">{item.time_text || "11:00 AM"}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-[#2C3039] group-hover:text-[#C0392B] transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-[#8A8478]">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#F0F0F8]">
 {item.duration_tag && (
 <span className="flex items-center gap-1.5 text-xs font-normal text-[#8A8478] bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E8E2D9]">
 <ClockIcon className="w-4 h-4 text-[#C0392B]" />
 <span>{item.duration_tag}</span>
 </span>
 )}
 <Link href={item.action_url || "/courses"} className="text-decoration-none shrink-0">
 <button type="button" className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#C0392B] font-medium text-xs hover:bg-[#E2E6FF] border border-[#C0392B]/20 transition-colors shadow-2xs cursor-pointer">
 {item.action_label || "Vào học ngay"}
 </button>
 </Link>
 </div>
 </div>
 );
 }

 // Default lesson progress card
 return (
 <div key={item.id || idx} className="bg-white border border-[#E8E2D9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-all duration-200 hover:border-[#2C3039]/30 group">
 <div className="flex items-center gap-4">
 <div className="w-11 h-11 rounded-xl bg-[#EAF8F5] text-[#2C3039] flex items-center justify-center shrink-0 border border-[#2C3039]/20">
 <PlayCircleIcon className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-[#2C3039] bg-[#EAF8F5] px-2 py-0.5 rounded-md border border-[#2C3039]/15">{item.badge_text || "Bài học hoàn tất"}</span>
 <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
 <span className="text-xs font-normal text-[#8A8478]">{item.time_text || "16:20 PM"}</span>
 </div>
 <h4 className="text-sm sm:text-base font-semibold text-[#2C3039] group-hover:text-[#2C3039] transition-colors">{item.title}</h4>
 <p className="text-xs font-normal text-[#8A8478]">{item.subtitle}</p>
 </div>
 </div>

 <div className="shrink-0 sm:w-44 flex flex-col sm:items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-0 border-[#F0F0F8]">
 <div className="flex items-center justify-between w-full text-xs">
 <span className="text-[#8A8478] font-normal">Tiến độ học:</span>
 <span className="text-[#2C3039] font-medium">{item.progress_label || "100% Hoàn thành"}</span>
 </div>
 <div className="w-full h-2 bg-[#F4F5FC] rounded-full overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div 
 className="h-full bg-[#2C3039] rounded-full" 
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
 <section className="relative overflow-hidden rounded-2xl bg-[#FEFCF9] border border-[#E8E2D9] p-6 sm:p-8 shadow-[0_8px_30px_rgba(192,57,43,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(192,57,43,0.12)]">
 <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#FAF7F2] blur-3xl pointer-events-none animate-pulse" />
 <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#C0392B]/15 blur-3xl pointer-events-none" />

 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div className="space-y-3 max-w-2xl">
 {/* Breadcrumbs */}
 <div className="flex items-center gap-2 text-xs font-normal text-[#8A8478]">
 <Link href="/courses" className="hover:text-[#C0392B] transition-colors text-decoration-none font-medium">
 Khoá học của tôi
 </Link>
 <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
 <span className="text-[#2C3039] font-medium bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#2C3039]/20">
 Lịch sử học tập
 </span>
 </div>

 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D9] text-xs font-medium text-[#C0392B] shadow-2xs">
 <span className="w-2 h-2 rounded-full bg-[#2C3039] animate-ping" />
 <span className="w-2 h-2 rounded-full bg-[#2C3039] absolute" />
 Nhật ký hoạt động hệ thống AI • 24/7
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3039] leading-tight">
 Lịch sử học tập: {" "}
 <span className="text-[#C0392B] drop-shadow-2xs font-bold">
 Hành trình Trí tuệ AI 
 </span>
 </h1>

 <p className="text-xs sm:text-sm text-[#8A8478] leading-relaxed font-normal">
 Theo dõi trọn vẹn các mốc học tập, kết quả kiểm tra và thành tích trên hành trình rèn luyện kỹ năng công nghệ cùng <span className="text-[#C0392B] font-medium">Gia sư Nova</span>.
 </p>
 </div>

 {/* Interactive Activity Mastery Widget */}
 <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#E8E2D9] flex flex-col justify-center min-w-[320px] sm:min-w-[370px] shadow-2xs hover:border-[#E8E2D9] transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-medium text-[#8A8478] group-hover:text-[#C0392B] transition-colors">Tổng quan hoạt động </span>
 <span className="text-[11px] font-medium text-[#2C3039] bg-[#FAF7F2]/70 px-2.5 py-0.5 rounded-full border border-[#2C3039]">
 {overview_card?.status_badge || "Tích cực 100%"}
 </span>
 </div>

 <div className="text-2xl font-semibold text-[#2C3039] my-1 flex items-baseline justify-between gap-6">
 <div>
 <span className="text-[#C0392B] font-semibold text-2xl sm:text-3xl">
 {overview_card?.total_activities || total_activities_count || 142}
 </span>
 <span className="text-xs font-normal text-[#8A8478] ml-1.5">lượt tương tác</span>
 </div>
 <span className="text-xs font-medium text-[#2C3039] bg-[#EAF8F5] px-2.5 py-0.5 rounded-md border border-[#2C3039]">
 {overview_card?.status_tag || "Active"}
 </span>
 </div>

 <div className="w-full h-2 bg-[#E8E2D9] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div className="h-full bg-[#C0392B] rounded-full shadow-[0_0_8px_rgba(192,57,43,0.3)] transition-all duration-1000 w-full group-hover:brightness-105" />
 </div>

 <p className="text-xs font-medium text-[#C0392B] mt-3 flex items-center justify-between">
 <span>{overview_card?.streak_label || " Chuỗi 30 ngày chuyên cần"}</span>
 <span className="text-[#C0392B] font-medium">{overview_card?.next_level_label || "Level 8 "}</span>
 </p>
 </div>
 </div>
 </section>

 {/* ─── 4 Key Metrics Row (Eye-Soothing Typography Guarantee - No Line Wrap) ─── */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
 
 {/* Total Lessons */}
 <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-[#C0392B]/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-[#8A8478]">Tổng số bài học</span>
 <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#C0392B] flex items-center justify-center shrink-0 border border-[#C0392B]/15 shadow-2xs">
 <BookIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-[#2C3039] tracking-normal">
 {metrics_row?.total_lessons?.value || 142} <span className="text-xs font-normal text-[#8A8478] ml-0.5">{metrics_row?.total_lessons?.unit || "bài"}</span>
 </span>
 <span className="text-[11px] font-medium text-[#2C3039] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#059669]/15">
 {metrics_row?.total_lessons?.change_tag || "+12% tháng này"}
 </span>
 </div>
 </div>

 {/* Avg Quiz Score */}
 <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-[#2C3039]/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-[#8A8478]">Điểm Quiz trung bình</span>
 <div className="w-9 h-9 rounded-xl bg-[#EAF8F5] text-[#2C3039] flex items-center justify-center shrink-0 border border-[#2C3039]/15 shadow-2xs">
 <TrophyIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-[#2C3039] tracking-normal">
 {metrics_row?.quiz_average?.value || "88%"}
 </span>
 <span className="text-[11px] font-medium text-[#0284C7] bg-[#FEFCF9] px-2.5 py-0.5 rounded-full border border-[#0284C7]/15 flex items-center gap-1">
 <TrendingUpIcon className="w-3 h-3" />
 <span>{metrics_row?.quiz_average?.progress_tag || "Tiến bộ tốt"}</span>
 </span>
 </div>
 </div>

 {/* Study Hours */}
 <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-[#0284C7]/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-[#8A8478]">Thời gian rèn luyện</span>
 <div className="w-9 h-9 rounded-xl bg-[#FEFCF9] text-[#0284C7] flex items-center justify-center shrink-0 border border-[#0284C7]/15 shadow-2xs">
 <ClockIcon className="w-4.5 h-4.5" />
 </div>
 </div>
 <div className="flex items-baseline justify-between gap-2">
 <span className="text-2xl font-semibold text-[#2C3039] whitespace-nowrap tracking-normal">
 {metrics_row?.study_hours?.value || "48.5"} <span className="text-sm font-normal text-[#8A8478]">{metrics_row?.study_hours?.unit || "giờ"}</span>
 </span>
 <span className="text-[11px] font-normal text-[#8A8478] bg-[#F8FAFC] px-2.5 py-0.5 rounded-lg border border-[#E8E2D9] whitespace-nowrap">
 {metrics_row?.study_hours?.tag || "Chuyên cần cao"}
 </span>
 </div>
 </div>

 {/* AI Proficiency */}
 <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between gap-3.5 group hover:border-[#9333EA]/30">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-[#8A8478]">Thành thạo công nghệ AI</span>
 <span className="text-[11px] font-medium text-[#9333EA] bg-[#F3E8FF]/80 px-2.5 py-0.5 rounded-full border border-[#9333EA]/15">
 {metrics_row?.ai_proficiency?.ranking_tag || " Top 10%"}
 </span>
 </div>
 <div className="space-y-2 pt-0.5">
 <div className="flex items-center justify-between text-sm font-semibold text-[#C0392B]">
 <span>{metrics_row?.ai_proficiency?.level_label || "Level 8"}</span>
 <span className="text-xs font-normal text-[#8A8478]">{metrics_row?.ai_proficiency?.xp_text || "80 / 100 XP"}</span>
 </div>
 <div className="w-full h-2 bg-[#F4F5FC] rounded-full overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div 
 className="h-full bg-[#C0392B] to-[#9333EA] rounded-full shadow-2xs" 
 style={{ width: `${metrics_row?.ai_proficiency?.percentage || 80}%` }}
 />
 </div>
 </div>
 </div>

 </div>

 {/* ─── Interactive Filter Bar & Export Actions ─── */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-xs font-medium text-[#8A8478] mr-1.5 flex items-center gap-1.5">
 <HistoryIcon className="w-4 h-4 text-[#C0392B]" />
 <span>Lọc theo hoạt động:</span>
 </span>

 <button
 type="button"
 onClick={() => setFilterType("all")}
 className={`px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
 filterType === "all"
 ? "bg-[#C0392B] text-white font-medium shadow-2xs"
 : "bg-[#F8FAFC] text-[#8A8478] border border-[#E8E2D9] hover:text-[#2C3039] hover:bg-white font-normal"
 }`}
 >
 Tất cả
 </button>

 <button
 type="button"
 onClick={() => setFilterType("quiz")}
 className={`px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
 filterType === "quiz"
 ? "bg-[#C0392B] text-white font-medium shadow-2xs"
 : "bg-[#F8FAFC] text-[#8A8478] border border-[#E8E2D9] hover:text-[#2C3039] hover:bg-white font-normal"
 }`}
 >
 Bài đánh giá (Quiz)
 </button>

 <button
 type="button"
 onClick={() => setFilterType("milestone")}
 className={`px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
 filterType === "milestone"
 ? "bg-[#C0392B] text-white font-medium shadow-2xs"
 : "bg-[#F8FAFC] text-[#8A8478] border border-[#E8E2D9] hover:text-[#2C3039] hover:bg-white font-normal"
 }`}
 >
 Cột mốc thành tựu
 </button>

 <button
 type="button"
 onClick={() => setFilterType("lesson")}
 className={`px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
 filterType === "lesson"
 ? "bg-[#C0392B] text-white font-medium shadow-2xs"
 : "bg-[#F8FAFC] text-[#8A8478] border border-[#E8E2D9] hover:text-[#2C3039] hover:bg-white font-normal"
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
 ? "bg-[#2C3039] text-white"
 : "bg-white border border-[#C0392B]/25 text-[#C0392B] hover:bg-[#FAF7F2]"
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
 group.icon_type === "calendar" ? "bg-[#FAF7F2] text-[#C0392B] border border-[#C0392B]/15" :
 group.icon_type === "calendar_light" ? "border border-[#E8E2D9] bg-[#F8FAFC] text-[#8A8478]" :
 "border border-[#E8E2D9] bg-[#F8FAFC] text-[#8A8478]"
 }`}>
 {group.icon_type === "history" ? <HistoryIcon className="w-4 h-4 text-[#8A8478]" /> : <CalendarIcon className="w-4 h-4" />}
 </div>
 <div>
 <h2 className="text-sm sm:text-base font-semibold text-[#2C3039]">{group.section_title}</h2>
 <p className="text-xs font-normal text-[#8A8478]">{group.subtitle}</p>
 </div>
 </div>

 <div className="flex flex-col gap-3.5 pl-3 sm:pl-5 border-l-2 border-[#EAECEE] ml-4">
 {group.is_compact ? (
 // Render compact items (weekly activities / reading logs)
 filteredItems.map((item, itemIdx) => (
 <div key={item.id || itemIdx} className="bg-white/90 border border-[#E8E2D9] rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white transition-all duration-150 shadow-2xs hover:border-[#E8E2D9]">
 <div className="flex items-center gap-3.5 min-w-0">
 <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9] text-[#8A8478] flex items-center justify-center shrink-0 shadow-2xs">
 {item.icon_type === "comment" ? <MessageSquareIcon className="w-4.5 h-4.5" /> : <FileTextIcon className="w-4.5 h-4.5" />}
 </div>
 <div className="min-w-0">
 <h4 className="text-xs sm:text-sm font-medium text-[#2C3039] truncate hover:text-[#C0392B] transition-colors">{item.title}</h4>
 <p className="text-[11px] font-normal text-[#8A8478]">{item.date_time_text || "Trong tuần"}</p>
 </div>
 </div>
 <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg shrink-0 border ${
 item.badge_color === "indigo" ? "text-[#C0392B] bg-[#FAF7F2] border-[#C0392B]/15" : "text-[#2C3039] bg-[#EAF8F5] border-[#2C3039]/15"
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
 className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-medium text-[#C0392B] hover:bg-[#FAF7F2] hover:border-[#C0392B]/30 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
 ? "bg-[#C0392B] text-white shadow-2xs"
 : "bg-white border border-[#E8E2D9] text-[#C0392B] hover:bg-[#FAF7F2] hover:border-[#C0392B]/30"
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
 className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-medium text-[#C0392B] hover:bg-[#FAF7F2] hover:border-[#C0392B]/30 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Sau →
 </button>
 </div>

 <p className="text-[11px] font-normal text-[#8A8478]">
 Trang {page} / {totalPages} • Tổng {pagination?.total_items ?? total_activities_count} hoạt động
 </p>
 </div>
 )}

 {totalPages <= 1 && (
 <div className="pt-2 flex flex-col items-center justify-center pb-6 gap-2">
 <p className="text-[11px] font-normal text-[#8A8478]">
 Đã hiển thị tất cả {total_activities_count} hoạt động rèn luyện
 </p>
 </div>
 )}

 </div>
 </div>
 );
}
