"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, SparklesIcon } from "./icons";
import { COURSE_DETAIL, MOCK_QUIZ } from "@/src/components/page/student/courses/constants/detail";
import { MY_COURSES } from "@/src/components/page/student/courses/constants/data";
import { STUDY_STREAK } from "@/src/components/page/student/dashboard/constants/data";
import type { IMyCourse } from "@/src/components/page/student/courses/types";

export function StudentProgressContainer() {
  const activeCourse: Partial<IMyCourse> = (MY_COURSES[0] as IMyCourse) || {};
  const { title, level, progress = 72, avgScore = 88 } = COURSE_DETAIL;
  const { lessonsCompleted = 18, totalLessons = 25 } = activeCourse;

  const [viewMode, setViewMode] = useState<"linear" | "module">("linear");

  const modules = [
    {
      id: 1,
      title: "Module 1: Nhập môn Kiến trúc Next.js 16 & App Router",
      lessonsCount: 3,
      status: "completed",
      completedLessons: 3,
      description: "Nắm vững luồng phân phối tải, bố cục file system và nguyên lý Render Server-side.",
    },
    {
      id: 2,
      title: "Module 2: Xử lý Dữ liệu Bất đồng bộ & Routing Nâng cao",
      lessonsCount: 8,
      status: "in-progress",
      completedLessons: 5,
      currentLessonTitle: COURSE_DETAIL.nextLesson || "Route Handlers & Streaming API",
      description: "Quản lý luồng dữ liệu thời gian thực và áp dụng kỹ thuật Optimistic Updates.",
    },
    {
      id: 3,
      title: "Module 3: Bảo mật Authentication & Tích hợp OAuth 2.0",
      lessonsCount: 6,
      status: "locked",
      completedLessons: 0,
      description: "Thiết lập tường lửa phân vùng người dùng và chứng thực đa nhân tố bằng JWT/OAuth.",
    },
    {
      id: 4,
      title: "Module 4: Tối ưu Hóa Hiệu năng & Triển khai Enterprise Cloud",
      lessonsCount: 8,
      status: "locked",
      completedLessons: 0,
      description: "Chuẩn hóa mã nguồn, nén tài nguyên động và triển khai mô hình đa vùng (Multi-region Cloud).",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F8] p-6 md:p-8 flex flex-col font-sans max-w-[1400px] mx-auto w-full gap-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2.5">
            <Link
              href="/courses"
              className="cursor-pointer hover:text-[#4F46E5] transition-colors"
            >
              Khóa học của tôi
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#4F46E5] font-extrabold">Tiến độ Học thuật &amp; Kỹ năng</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Chuyên ngành {level} &bull; Lộ trình Công nghệ Web Hiện đại &amp; Tích hợp Trí tuệ Nhân tạo MindNova
          </p>
        </div>

        {/* Header Stats Box */}
        <div className="flex items-center gap-6 shrink-0 bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-[#4F46E5] font-mono">{progress}%</span>
            <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Hoàn tất</span>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black text-gray-900 font-mono">
              {lessonsCompleted} / {totalLessons}
            </span>
            <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Bài giảng</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:border-indigo-200 transition-all duration-200">
          <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-2">Tổng Thời Gian Học</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-black text-gray-900 font-mono">12.5 giờ</span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              +2.4h tuần qua
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:border-indigo-200 transition-all duration-200">
          <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-2">Điểm Kiểm Tra Trung Bình</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-black text-[#4F46E5] font-mono">{avgScore}/100</span>
            <span className="text-xs font-bold text-gray-500">
              Top 5% học viên xuất sắc nhất
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:border-indigo-200 transition-all duration-200">
          <h3 className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-2">Kỹ Năng Đã Làm Chủ</h3>
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-black text-gray-900 font-mono">6 / 8</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Chứng chỉ Blockchain
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex flex-col lg:flex-row gap-8 items-start pt-2 pb-12">
        {/* Left Column - Roadmap View */}
        <div className="flex-1 w-full flex flex-col">
          {/* Roadmap Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-black text-gray-900">Bản Đồ Lộ Trình Học Tập</h2>
              <p className="text-xs text-gray-500 mt-0.5">Trình diễn tiến độ phân dải kỹ thuật theo từng cụm module</p>
            </div>
            <div className="flex items-center bg-white border border-gray-200 p-1 rounded-2xl shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("linear")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === "linear"
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                📈 Lộ trình tuần tự
              </button>
              <button
                type="button"
                onClick={() => setViewMode("module")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === "module"
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                📦 Cụm chuyên đề (Modules)
              </button>
            </div>
          </div>

          {/* View Mode 1: Linear Timeline */}
          {viewMode === "linear" && (
            <div className="relative pl-3">
              {/* Vertical Glowing Line */}
              <div className="absolute left-[22px] top-5 bottom-5 w-1 bg-gradient-to-b from-emerald-500 via-[#4F46E5] to-gray-300 rounded-full" />

              <div className="flex flex-col gap-6">
                {/* Step 1 - Completed */}
                <div className="relative flex items-center gap-5 group">
                  <div className="relative z-10 w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    ✓
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs group-hover:border-emerald-200 transition-all">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 mb-1">
                        {modules[0].title}
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold">
                        {modules[0].lessonsCount} Bài giảng &bull; <span className="text-emerald-600 font-bold">Đã hoàn tất 100%</span>
                      </p>
                    </div>
                    <Link
                      href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer block text-center uppercase tracking-wider"
                    >
                      Ôn Bài ➔
                    </Link>
                  </div>
                </div>

                {/* Step 2 - Active */}
                <div className="relative flex items-start gap-5 group">
                  <div className="relative z-10 w-7 h-7 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-xs shrink-0 mt-5 shadow-2xs animate-pulse">
                    ▶
                  </div>
                  <div className="flex-1 bg-white border-2 border-[#4F46E5] rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-black text-[#4F46E5] uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 inline-block mb-2">
                          ⚡ Đang thực hiện
                        </span>
                        <h3 className="text-base font-black text-gray-900 mb-1">
                          {modules[1].title}
                        </h3>
                        <p className="text-xs text-gray-600 font-semibold">
                          Đang tiến độ tới bài: <span className="text-[#4F46E5] font-black underline">{modules[1].currentLessonTitle}</span>
                        </p>
                      </div>
                      <Link
                        href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                        className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all shrink-0 cursor-pointer block text-center uppercase tracking-wider active:scale-[0.99]"
                      >
                        Tiếp tục học ➔
                      </Link>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-500 mb-1.5 font-mono">
                      <span>Tiến độ chuyên đề</span>
                      <span>{modules[1].completedLessons}/{modules[1].lessonsCount} bài hoàn tất (62.5%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60">
                      <div className="w-[62.5%] h-full bg-[#4F46E5] rounded-full transition-all duration-500" />
                    </div>
                  </div>
                </div>

                {/* Step 3 - Locked */}
                <div className="relative flex items-center gap-5">
                  <div className="relative z-10 w-7 h-7 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center font-black text-xs shrink-0">
                    🔒
                  </div>
                  <div className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl opacity-75">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">
                      {modules[2].title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {modules[2].lessonsCount} Bài giảng &bull; <span className="text-amber-700 font-bold">Khóa chờ xác thực bài kiểm tra</span>
                    </p>
                  </div>
                </div>

                {/* Step 4 - Locked */}
                <div className="relative flex items-center gap-5">
                  <div className="relative z-10 w-7 h-7 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center font-black text-xs shrink-0">
                    🔒
                  </div>
                  <div className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl opacity-75">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">
                      {modules[3].title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {modules[3].lessonsCount} Bài giảng &bull; <span className="text-amber-700 font-bold">Khóa chờ xác thực bài kiểm tra</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Mode 2: Module Cards Matrix */}
          {viewMode === "module" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 shadow-2xs h-full ${
                    mod.status === "completed"
                      ? "bg-white border-gray-200 hover:border-emerald-300"
                      : mod.status === "in-progress"
                      ? "bg-gradient-to-br from-indigo-50/40 to-white border-2 border-[#4F46E5]"
                      : "bg-gray-50 border-gray-200 opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-gray-100 text-gray-700 border border-gray-200">
                        {mod.lessonsCount} Bài giảng
                      </span>
                      {mod.status === "completed" && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                          ✓ Đã hoàn tất
                        </span>
                      )}
                      {mod.status === "in-progress" && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[#4F46E5] text-white">
                          ⚡ Đang học
                        </span>
                      )}
                      {mod.status === "locked" && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-gray-200 text-gray-600">
                          🔒 Chưa mở khóa
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-gray-900 mb-2 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                      {mod.description}
                    </p>
                  </div>

                  {mod.status === "in-progress" ? (
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1 font-mono">
                        <span>Tiến độ</span>
                        <span>{mod.completedLessons}/{mod.lessonsCount}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-[#4F46E5]"
                          style={{ width: `${(mod.completedLessons / mod.lessonsCount) * 100}%` }}
                        />
                      </div>
                      <Link
                        href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                        className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold text-center block transition-all uppercase tracking-wider shadow-2xs"
                      >
                        Tiếp tục chuyên đề ➔
                      </Link>
                    </div>
                  ) : mod.status === "completed" ? (
                    <Link
                      href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                      className="mt-auto w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold text-center block transition-all uppercase tracking-wider"
                    >
                      Xem lại học liệu ➔
                    </Link>
                  ) : (
                    <div className="mt-auto w-full py-2.5 rounded-xl bg-gray-200/60 text-gray-400 text-xs font-bold text-center border border-dashed border-gray-300">
                      Cần hoàn thành module trước
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Nova AI Insights */}
        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 leading-tight">Trợ Lý AI Phân Tích</h3>
                <span className="text-[10px] font-mono font-extrabold text-[#4F46E5] uppercase tracking-wider">
                  Cập nhật lộ trình theo giờ
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[11px] font-black tracking-widest text-red-500 uppercase mb-2 flex items-center gap-1.5">
                <span>🔥</span>
                <span>Trọng Điểm Cần Chú Ý</span>
              </h4>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed p-3 rounded-xl bg-red-50/50 border border-red-100">
                Việc nắm chắc Server Components &amp; Route Handlers là cốt lõi để chinh phục chuyên mục Authentication sắp tới.{" "}
                <Link
                  href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                  className="text-[#4F46E5] font-extrabold hover:underline cursor-pointer block mt-2"
                >
                  Xem lại bài giảng ngay &rarr;
                </Link>
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-black tracking-widest text-indigo-600 uppercase mb-2 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Thử Thách Kế Tiếp</span>
              </h4>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed mb-3">
                Hoàn thành bài thi thực nghiệm &quot;{MOCK_QUIZ.title}&quot; để xác nhận năng lực và tích lũy điểm thưởng AI.
              </p>
              <Link
                href="/practice"
                className="text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] px-4 py-3 rounded-xl shadow-2xs transition-all duration-200 block w-full text-center cursor-pointer uppercase tracking-wider active:scale-[0.99]"
              >
                Bắt đầu làm thi ({Math.floor(MOCK_QUIZ.durationSeconds / 60)} phút) &rarr;
              </Link>
            </div>

            <div className="h-px bg-gray-200 w-full my-6" />

            <div className="space-y-3 font-medium">
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Chuỗi ngày học liên tục</span>
                <span className="text-sm font-black text-gray-900 font-mono">{STUDY_STREAK.days} Ngày 🔥</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Xếp loại học lực AI</span>
                <span className="text-sm font-black text-emerald-600 font-mono">Xuất sắc (Hạng A)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export as ProgressContent for backward compatibility
export const ProgressContent = StudentProgressContainer;
