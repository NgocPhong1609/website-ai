"use client";

import React from "react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetCourseDetail } from "../../api";
import { CourseHeader } from "./CourseHeader";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { CourseSidebar } from "./CourseSidebar";

export function CourseDetailWorkspace({ courseId = 1 }: { courseId?: string | number }) {
  const { data, isLoading, isError, refetch } = useGetCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Đang đồng bộ dữ liệu giáo trình và trợ lý AI Nova cho khóa học..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center text-2xl mb-1 shadow-sm border border-[#FCA5A5]/40">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">Không thể tải thông tin khóa học</h3>
        <p className="text-xs text-[#64647A] max-w-md leading-relaxed">
          Đã xảy ra sự cố khi kết nối tới máy chủ khóa học MindNova AI. Vui lòng kiểm tra kết nối mạng và thử tải lại sau ít phút.
        </p>
        <button 
          type="button"
          onClick={() => refetch()} 
          className="mt-2 px-6 py-2.5 bg-[#5052EE] text-white text-xs font-semibold rounded-xl hover:bg-[#4648D4] transition-all cursor-pointer shadow-sm"
        >
          🔄 Thử tải lại ngay
        </button>
      </div>
    );
  }

  const { header_info, progress_card, ai_insight, instructor, modules, resources } = data;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8">
      {/* Main Content (Left) */}
      <div className="flex-1 w-full min-w-0">
        <CourseHeader info={header_info} />
        <CurriculumAccordion modules={modules} courseId={courseId} />
      </div>

      {/* Sidebar (Right) */}
      <CourseSidebar 
        progress={progress_card}
        aiInsight={ai_insight}
        instructor={instructor}
        resources={resources}
        isEnrolled={header_info.is_enrolled}
        price={header_info.price}
        courseId={courseId}
      />
    </div>
  );
}
