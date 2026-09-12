"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseDetailHeaderInfo } from "../../types";
import { StudentRefundModal } from "../StudentRefundModal";
import { Banknote } from "lucide-react";
import toast from "react-hot-toast";

const SAVED_COURSES_KEY = "mindnova_saved_courses_v1";

export function CourseHeader({ info }: { info?: CourseDetailHeaderInfo }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

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
            <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <Link href="/courses" className="hover:text-[#0F172A] transition-colors text-decoration-none">
                Khóa học của tôi
              </Link>
              <span className="text-[#94A3B8]">/</span>
              <span className="text-[#3B82F6] font-semibold bg-[#F8FAFC] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                Chi tiết học phần
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#0F172A] bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                {categoryTag}
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                Level: {level}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#0F172A] leading-tight font-serif">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#64748B] pt-2 border-t border-[#E2E8F0]">
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="font-semibold text-[#64748B]">Thời lượng:</span>
              <span>{durationText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="font-semibold text-[#64748B]">Học viên:</span>
              <span>{studentsText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="font-semibold text-[#64748B]">Đánh giá:</span>
              <span className="text-[#3B82F6] font-bold">{ratingText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] font-bold">
              <span>Chứng nhận kỹ năng AI MindNova</span>
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
                      ? "bg-[#0F172A] border-[#0F172A] text-white"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <span>{isSaved ? "Đã lưu vào danh mục" : "Lưu khóa học"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRefundOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold bg-[#EFF6FF] hover:bg-[#EFF6FF]/80 text-[#3B82F6] border border-[#3B82F6]/20 transition-all cursor-pointer shadow-2xs"
                  title="Yêu cầu hoàn tiền khóa học nếu tiến độ ≤ 10% hoặc chưa học quá 5 bài"
                >
                  <span className="flex items-center gap-1.5"><Banknote size={16} /> Yêu cầu hoàn tiền</span>
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
                      ? "bg-[#0F172A] border-[#0F172A] text-white"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <span>{isSaved ? "Đã lưu vào danh mục" : "Lưu khóa học"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {isEnrolled && (
        <StudentRefundModal
          isOpen={isRefundOpen}
          onClose={() => setIsRefundOpen(false)}
          courseId={info?.id || 1}
          courseTitle={title}
        />
      )}
    </div>
  );
}
