"use client";

import React from "react";
import { CourseHeader } from "./CourseHeader";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { CourseSidebar } from "./CourseSidebar";

export function CourseDetailContainer() {
  return (
    <div className="min-h-screen bg-[#F4F4F8] p-6 md:p-8 flex flex-col font-sans max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row items-start gap-8 pb-12 w-full">
        {/* Main Left Content Area */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          <CourseHeader />

          {/* Curriculum Section Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  Nội Dung Đào Tạo &amp; Chương Trình Học
                </h2>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Bấm chọn vào chuyên đề để xem cấu trúc bài giảng hoặc tiếp tục theo dõi ngay bài học tiếp theo.
                </p>
              </div>
              <span className="px-3.5 py-1.5 bg-indigo-50 text-[#4F46E5] text-xs font-black rounded-xl border border-indigo-100 shrink-0 font-mono uppercase">
                📦 4 Cụm Module
              </span>
            </div>

            <CurriculumAccordion />
          </div>
        </div>

        {/* Right Sidebar Statistics & Resources */}
        <CourseSidebar />
      </div>
    </div>
  );
}
