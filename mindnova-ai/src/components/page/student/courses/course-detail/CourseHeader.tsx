"use client";

import React from "react";
import Link from "next/link";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";

export function CourseHeader() {
  const { title, level, description, nextLesson, nextLessonId } = COURSE_DETAIL;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-2xs mb-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 mb-5">
        <Link href="/courses" className="hover:text-[#4F46E5] transition-colors">
          Khóa học của tôi
        </Link>
        <span>/</span>
        <span className="text-[#4F46E5] font-extrabold">{title}</span>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-3 py-1 rounded-xl text-[11px] font-mono font-black text-white bg-[#4F46E5] tracking-wider uppercase shadow-2xs">
            ⚡ {level || "Nâng cao"}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-xl text-[11px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase">
            ✓ Trợ lý AI Hậu thuẫn
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
          {title}
        </h1>
        <p className="text-sm text-gray-600 max-w-4xl leading-relaxed font-medium mt-1">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3.5 mt-6 pt-6 border-t border-gray-100">
        <Link
          href={`/courses/${nextLessonId || "101"}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-2xs active:scale-[0.99] uppercase tracking-wider cursor-pointer"
        >
          <span>▶️ Bắt đầu vào học ngay ({nextLesson || "Bài 01"})</span>
        </Link>
        <button
          type="button"
          onClick={() => alert("Đã lưu chuỗi khóa học vào danh sách quan tâm!")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all uppercase tracking-wider cursor-pointer"
        >
          <span>🔖 Lưu chuyên đề</span>
        </button>
      </div>
    </div>
  );
}
