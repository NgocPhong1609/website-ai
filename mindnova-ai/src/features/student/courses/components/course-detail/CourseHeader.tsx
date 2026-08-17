"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseDetailHeaderInfo } from "../../types";

const SAVED_COURSES_KEY = "mindnova_saved_courses_v1";

export function CourseHeader({ info }: { info?: CourseDetailHeaderInfo }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!info?.id) return;

    try {
      const raw = window.localStorage.getItem(SAVED_COURSES_KEY);
      const savedIds = raw ? (JSON.parse(raw) as Array<string | number>) : [];
      setIsSaved(savedIds.some((id) => String(id) === String(info.id)));
    } catch {
      setIsSaved(false);
    }
  }, [info?.id]);

  const title = info?.title || "AI & Neural Networks • Fullstack Next.js 15";
  const level = info?.level || "Intermediate";
  const description = info?.description || "Chuyên đề đào tạo toàn diện: từ kiến trúc mạng Nơ-ron lượng tử, thuật toán tối ưu hóa cho đến mô hình Transformers tạo sinh trong các hệ thống phần mềm thực tế.";
  const nextLesson = info?.next_lesson_title || "RMSprop Optimization & Adam Optimizer";
  const nextLessonId = info?.next_lesson_id || "l1-2";
  const durationText = info?.duration_text || "0 Phút tổng cộng";
  const ratingText = info?.rating_text || "0.0 ⭐ (0 Đánh giá)";
  const studentsText = info?.students_text || "0 Học viên tích cực";
  const categoryTag = info?.category_tag || "Chuyên đề Core AI • Kỳ II";

  const handleSaveToggle = () => {
    if (!info?.id) return;

    const courseId = String(info.id);
    const raw = window.localStorage.getItem(SAVED_COURSES_KEY);
    const savedIds: Array<string | number> = raw ? JSON.parse(raw) : [];
    const nextSavedIds = isSaved
      ? savedIds.filter((id) => String(id) !== courseId)
      : [...savedIds.filter((id) => String(id) !== courseId), courseId];

    window.localStorage.setItem(SAVED_COURSES_KEY, JSON.stringify(nextSavedIds));
    setIsSaved(!isSaved);
    alert(!isSaved ? "🔖 Đã lưu khóa học vào danh sách quan tâm của bạn!" : "Đã bỏ lưu khóa học.");
  };

  return (
    <div className="mb-8">
      {/* ─── Synchronized Hero Banner matching /courses, /study-plan, & /progress ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/95 via-[#F6F6FB] to-[#E0F2FE]/85 border border-[#6B6BFF]/25 p-6 sm:p-8 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)]">
        {/* Animated background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Breadcrumb & Pill tag */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-2 text-xs font-medium text-[#64647A]">
              <Link href="/courses" className="hover:text-[#5052EE] transition-colors text-decoration-none">
                Khóa học của tôi
              </Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A0A0C0]">
                <path d="M9 18l6-6-6-6" />
              </svg>
              <span className="text-[#0D9488] font-semibold bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">
                Chi tiết học phần
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-full border border-[#0284C7]/20">
                {categoryTag}
              </span>
              <span className="text-[11px] font-semibold text-[#D97706] bg-[#FFF8EB] px-2.5 py-1 rounded-full border border-[#D97706]/20">
                Level: {level}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#1A1A2E] leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#4B5563] pt-2 border-t border-[#6B6BFF]/15">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EAEAF4] shadow-2xs">
              <span>⏱</span>
              <span>{durationText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EAEAF4] shadow-2xs">
              <span>👥</span>
              <span>{studentsText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EAEAF4] shadow-2xs text-[#0D9488] font-semibold">
              <span>🌟</span>
              <span>{ratingText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EAEAF4] shadow-2xs text-[#5052EE] font-semibold">
              <span>🛡</span>
              <span>Chứng nhận kỹ năng AI MindNova</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {info?.is_enrolled ? (
              <Link 
                href={`/courses/lesson?courseId=${info?.id || 1}&lessonId=${nextLessonId}`}
                className="text-decoration-none"
              >
                <button
                  type="button"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(80,82,238,0.35)] hover:shadow-[0_6px_22px_rgba(80,82,238,0.45)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
                  <span>▶ Tiếp tục bài học: <strong className="underline decoration-white/50">{nextLesson}</strong></span>
                </button>
              </Link>
            ) : (
              <Link 
                href={`/checkout?courseId=${info?.id || 1}`}
                className="text-decoration-none"
              >
                <button
                  type="button"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(80,82,238,0.35)] hover:shadow-[0_6px_22px_rgba(80,82,238,0.45)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>🛒 Đăng ký khóa học ngay: <strong className="underline decoration-white/50">{Number(info?.price ? info?.price : 0).toLocaleString('vi-VN')} VND</strong></span>
                </button>
              </Link>
            )}

            <button
              type="button"
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                isSaved 
                  ? "bg-[#D1FAE5] border-[#059669]/30 text-[#059669]" 
                  : "bg-white border-[#EAEAF4] text-[#4B5563] hover:bg-[#EEF2FF] hover:border-[#5052EE]/30 hover:text-[#5052EE]"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>{isSaved ? "Đã lưu vào danh sách quan tâm" : "Lưu khóa học"}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
