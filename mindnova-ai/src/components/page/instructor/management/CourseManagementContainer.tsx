"use client";

import React from "react";
import { AIBanner } from "./AIBanner";
import { RevenueCard } from "./RevenueCard";
import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";
import { MOCK_COURSES } from "./constants/data";

export function CourseManagementContainer() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] font-sans">
      <div className="max-w-[1200px] w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 pb-20 animate-fadeIn">
        {/* ── Page Header & Filter Tabs ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Quản lý khóa học
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 font-medium max-w-xl leading-relaxed">
              Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn với sự hỗ trợ của trí tuệ nhân tạo MindNova AI.
            </p>
          </div>

          <CourseFilterTabs />
        </div>

        {/* ── Banner + Revenue Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <AIBanner />
          <RevenueCard />
        </div>

        {/* ── Course Grid ──────────────────────────────────────────────────────── */}
        <section aria-label="Danh sách khóa học">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            <CreateCourseCard />
          </div>
        </section>

        {/* ── Pagination ───────────────────────────────────────────────────────── */}
        <CoursePagination />
      </div>
    </div>
  );
}
