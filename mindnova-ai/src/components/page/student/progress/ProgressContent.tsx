import React from "react";
import Link from "next/link";
import { ChevronRightIcon, SparklesIcon } from "./icons";
import { COURSE_DETAIL, MOCK_QUIZ } from "@/src/components/page/student/courses/constants/detail";
import { MY_COURSES } from "@/src/components/page/student/courses/constants/data";
import { STUDY_STREAK } from "@/src/components/page/student/dashboard/constants/data";
import type { IMyCourse } from "@/src/components/page/student/courses/types";

export function ProgressContent() {
  const activeCourse: Partial<IMyCourse> = (MY_COURSES[0] as IMyCourse) || {};
  const { title, level, progress, avgScore } = COURSE_DETAIL;
  const { lessonsCompleted = 18, totalLessons = 25 } = activeCourse;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F8] min-h-full">
      <div className="max-w-[1200px] mx-auto w-full p-6 lg:p-10 space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] mb-3">
              <Link
                href="/courses"
                className="cursor-pointer hover:text-[#4F46E5] transition-colors bg-transparent border-0 p-0 font-medium"
              >
                My Courses
              </Link>
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[#4F46E5] font-bold">Learning Progress</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] leading-tight mb-1">
              {title}
            </h1>
            <p className="text-[14px] text-[#6B7280] font-medium">
              {level} Specialization &bull; Modern Web Development &amp; AI Curriculum
            </p>
          </div>
          
          {/* Header Stats */}
          <div className="flex items-center gap-8 shrink-0 bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex flex-col items-end">
              <span className="text-2xl font-extrabold text-[#4F46E5]">{progress}%</span>
              <span className="text-[10px] font-extrabold tracking-widest text-[#6B7280] uppercase">Complete</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-extrabold text-[#111827]">
                {lessonsCompleted} / {totalLessons}
              </span>
              <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Lessons</span>
            </div>
          </div>
        </div>

        {/* Stats Row (White surface cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase mb-2">Total Study Time</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[20px] font-extrabold text-[#111827]">12.5 hrs</span>
              <span className="text-[13px] font-bold text-[#4F46E5]">+2.4h this week</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase mb-2">Quiz Average</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[20px] font-extrabold text-[#111827]">{avgScore}%</span>
              <span className="text-[13px] font-medium text-[#6B7280]">Top 5% in Next.js Fullstack</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase mb-2">Skills Mastered</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[20px] font-extrabold text-[#111827]">6/8</span>
              <span className="text-[13px] font-medium text-[#6B7280]">Core Next.js competencies</span>
            </div>
          </div>

        </div>

        {/* Main Roadmap Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          
          {/* Left Column - Roadmap */}
          <div className="flex-1 w-full flex flex-col">
            
            {/* Roadmap Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-[18px] font-bold text-[#111827]">Visual Roadmap</h2>
              <div className="flex items-center bg-white border border-gray-200 p-1 rounded-xl shadow-2xs">
                <button type="button" className="px-4 py-1.5 rounded-lg text-[12px] font-bold text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer">
                  Module View
                </button>
                <button type="button" className="px-4 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-bold shadow-2xs cursor-default">
                  Linear Progression
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-200" />

              <div className="flex flex-col gap-6">
                
                {/* Item 1 - Completed */}
                <div className="relative flex items-center gap-6 group">
                  <div className="relative z-10 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between py-3 pr-2 bg-white px-5 rounded-2xl border border-gray-200 shadow-2xs">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#111827] mb-0.5">Module 1: Introduction to Next.js &amp; App Router</h3>
                      <p className="text-[13px] font-medium text-[#6B7280]">3 Lessons &bull; Completed</p>
                    </div>
                    <Link
                      href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                      className="px-3.5 py-1.5 bg-[#EEF2FF] text-[#4F46E5] rounded-xl text-[12px] font-extrabold hover:bg-[#E0E7FF] transition-colors cursor-pointer border border-indigo-100 inline-block text-center"
                    >
                      REVIEW
                    </Link>
                  </div>
                </div>

                {/* Item 2 - Active */}
                <div className="relative flex items-start gap-6">
                  <div className="relative z-10 w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-6 border border-indigo-200">
                    <div className="w-3 h-3 rounded-full bg-[#4F46E5] shadow-[0_0_0_4px_rgba(79,70,229,0.15)]" />
                  </div>
                  <div className="flex-1 bg-white border-2 border-[#4F46E5]/40 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-wider bg-[#EEF2FF] px-2.5 py-0.5 rounded-md border border-indigo-100 inline-block mb-2">
                          In Progress
                        </span>
                        <h3 className="text-[16px] font-bold text-[#111827] mb-1">Module 2: Advanced Data Fetching &amp; Routing</h3>
                        <p className="text-[13px] font-medium text-[#6B7280]">Currently on: <span className="text-[#111827] font-bold">{COURSE_DETAIL.nextLesson}</span></p>
                      </div>
                      <Link
                        href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                        className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl text-[13px] font-extrabold shadow-sm hover:bg-[#4338CA] transition-all shrink-0 cursor-pointer inline-block text-center"
                      >
                        CONTINUE
                      </Link>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-[66%] h-full bg-[#4F46E5] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Item 3 - Locked */}
                <div className="relative flex items-center gap-6 mt-1">
                  <div className="relative z-10 w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex-1 py-3.5 px-5 bg-gray-50 border border-gray-200 rounded-2xl pr-2 opacity-75">
                    <h3 className="text-[15px] font-bold text-gray-700 mb-0.5">Module 3: Authentication &amp; OAuth Providers</h3>
                    <p className="text-[13px] font-medium text-gray-500">2 Lessons &bull; Locked</p>
                  </div>
                </div>

                {/* Item 4 - Locked */}
                <div className="relative flex items-center gap-6">
                  <div className="relative z-10 w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex-1 py-3.5 px-5 bg-gray-50 border border-gray-200 rounded-2xl pr-2 opacity-75">
                    <h3 className="text-[15px] font-bold text-gray-700 mb-0.5">Module 4: Performance Optimization &amp; Deployment</h3>
                    <p className="text-[13px] font-medium text-gray-500">4 Lessons &bull; Locked</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 flex items-center justify-center shrink-0">
                  <SparklesIcon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#111827]">Nova&apos;s Insights</h3>
              </div>

              <div className="mb-6">
                <h4 className="text-[10px] font-extrabold tracking-widest text-[#4F46E5] uppercase mb-1.5">Priority Review</h4>
                <p className="text-[13px] font-medium text-[#6B7280] leading-relaxed">
                  Understanding Server Components &amp; Route Handlers is key for upcoming Authentication.{" "}
                  <Link
                    href={`/courses/detail?courseId=${COURSE_DETAIL.id}`}
                    className="text-[#4F46E5] font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 inline"
                  >
                    Review lesson &rarr;
                  </Link>
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-extrabold tracking-widest text-[#6B7280] uppercase mb-1.5">Next Milestone</h4>
                <p className="text-[13px] font-medium text-[#6B7280] leading-relaxed mb-3">
                  Take the &quot;{MOCK_QUIZ.title}&quot; practice quiz to validate your skills and boost retention.
                </p>
                <Link
                  href="/practice"
                  className="text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 block w-full text-center cursor-pointer"
                >
                  Start Practice Quiz ({Math.floor(MOCK_QUIZ.durationSeconds / 60)} mins) &rarr;
                </Link>
              </div>

              <div className="h-px bg-gray-200 w-full my-6" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#6B7280]">Streak</span>
                  <span className="text-[14px] font-extrabold text-[#111827]">{STUDY_STREAK.days} Days 🔥</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#6B7280]">Avg Quiz Score</span>
                  <span className="text-[14px] font-extrabold text-emerald-600">{avgScore}% (A)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
