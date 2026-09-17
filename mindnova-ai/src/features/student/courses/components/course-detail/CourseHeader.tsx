"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseDetailHeaderInfo } from "../../types";
import { Clock, Star, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

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

  const title = info?.title || "Khóa học AI MindNova";
  const level = info?.level || "Beginner";
  const description = info?.description || "Chương trình đào tạo chất lượng cao cung cấp kiến thức nền tảng và nâng cao.";
  const nextLesson = info?.next_lesson_title || "Bài giảng tiếp theo";
  const nextLessonId = info?.next_lesson_id || "1";
  const durationText = info?.duration_text || "0 Phút tổng cộng";
  const ratingText = info?.rating_text || "0.0 (0 Đánh giá)";
  const studentsText = info?.students_text || "0 Học viên tích cực";
  const categoryTag = info?.category_tag || "Khóa học AI";
  const isEnrolled = !!info?.is_enrolled;

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
    toast.success(!isSaved ? "Đã lưu khóa học vào danh sách quan tâm của bạn!" : "Đã bỏ lưu khóa học.");
  };

  return (
    <div className="mb-8">
      {/* ─── Editorial Hero Banner ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 transition-all duration-300">
        <div className="relative z-10 flex flex-col gap-6">
          {/* Breadcrumb & Pill tag */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
              <Link href="/courses" className="hover:text-[#0F172A] transition-colors text-decoration-none">
                Khóa học của tôi
              </Link>
              <ChevronRight size={14} className="text-[#94A3B8]" />
              <span className="text-[#0F172A] font-semibold">
                Chi tiết học phần
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <span className="inline-block text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
                {categoryTag}
              </span>
              <span className="inline-block text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#E2E8F0] capitalize">
                {level}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight text-[#0F172A] leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-4 mt-2 border-t border-[#E2E8F0]/60">
            <span className="inline-flex items-center gap-1.5 px-1 py-1.5 text-[#0F172A]">
              <Clock size={14} className="text-[#64748B]" />
              <span className="font-semibold">{durationText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-1 py-1.5 text-[#0F172A]">
              <Star size={14} className="fill-[#EAB308] text-[#EAB308]" />
              <span className="font-semibold">{ratingText}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isEnrolled ? (
              <>
                <Link
                  href={`/courses/lesson?courseId=${info?.id || 1}&lessonId=${nextLessonId}`}
                  className="text-decoration-none"
                >
                  <button
                    type="button"
                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all cursor-pointer shadow-sm"
                  >
                    <span>Tiếp tục bài học: <strong className="font-normal underline decoration-white/50">{nextLesson}</strong></span>
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={handleSaveToggle}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSaved
                      ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB] hover:bg-[#DBEAFE]"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>{isSaved ? "Đã lưu vào danh mục" : "Lưu khóa học"}</span>
                </button>

              </>
            ) : (
              <>
                <Link
                  href={`/checkout?courseId=${info?.id || 1}`}
                  className="text-decoration-none"
                >
                  <button
                    type="button"
                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all cursor-pointer shadow-sm"
                  >
                    <span>Đăng ký học ngay — {(info?.price ? info.price.toLocaleString("vi-VN") + " VNĐ" : "Miễn phí")}</span>
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={handleSaveToggle}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSaved
                      ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB] hover:bg-[#DBEAFE]"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>{isSaved ? "Đã lưu vào danh mục" : "Lưu khóa học"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
