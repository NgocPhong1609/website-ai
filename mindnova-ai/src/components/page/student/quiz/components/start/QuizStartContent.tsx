"use client"

import { useRouter } from "next/navigation";

export function QuizStartContent() {
  const router = useRouter();
  return (
    <div className="flex-1 overflow-y-auto bg-white relative min-h-full">
      {/* Soft Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#EEF2FF]/60 to-transparent pointer-events-none" />

      <div className="relative p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <span className="text-gray-500 font-medium">Courses</span>
          <span className="text-gray-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
          <span className="text-gray-500 font-medium">Next.js Advanced</span>
          <span className="text-gray-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
          <span className="text-[#6B6BFF] font-semibold">Quiz</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-[2.75rem] leading-tight font-extrabold text-[#1F2937] mb-4 tracking-tight">
          Quiz: Route Handlers in Next.js
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          Test your knowledge on creating API endpoints and managing request
          methods in Next.js. This quiz covers GET, POST, DELETE handlers, and
          dynamic routing logic.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F3F4F6]">
              <h3 className="text-xl font-bold text-gray-900 mb-8">
                Quiz Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                {/* Stat: Questions */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Questions
                    </p>
                    <p className="text-[17px] font-bold text-gray-900">
                      10 Items
                    </p>
                  </div>
                </div>

                {/* Stat: Time Limit */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Time Limit
                    </p>
                    <p className="text-[17px] font-bold text-gray-900">
                      8 Minutes
                    </p>
                  </div>
                </div>

                {/* Stat: Passing Score */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Passing Score
                    </p>
                    <p className="text-[17px] font-bold text-gray-900">
                      70% (7/10)
                    </p>
                  </div>
                </div>

                {/* Stat: Attempts */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      Attempts
                    </p>
                    <p className="text-[17px] font-bold text-gray-900">
                      Unlimited
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-[#F3F4F6] my-8" />

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-5">
                  Instructions
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-[18px] h-[18px] text-[#6B6BFF] shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-[#374151]">
                      Ensure you have a stable internet connection before
                      starting.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-[18px] h-[18px] text-[#6B6BFF] shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-[#374151]">
                      The timer starts as soon as you click the button.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-[18px] h-[18px] text-[#6B6BFF] shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-[#374151]">
                      You can skip questions and return to them later.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-white to-[#EEF2FF]/60 border border-[#E0E7FF] rounded-2xl p-6 flex gap-5 items-start shadow-sm">
              <div className="w-12 h-12 rounded-[14px] bg-[#2E3192] text-white flex items-center justify-center shrink-0 shadow-md">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
              </div>
              <div className="pt-0.5">
                <h4 className="text-[17px] font-bold text-[#2E3192] mb-1.5">
                  AI Tutor Insight
                </h4>
                <p className="text-[#4B5563] leading-relaxed text-[15px]">
                  Most students find question 4 and 7 challenging in this
                  module. Focus on the differences between Request and Response
                  objects in standard Web APIs versus Next.js wrappers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Actions) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Start Card */}
            <div className="bg-[#F8F9FC] rounded-[24px] p-5 shadow-sm border border-[#F0F2F5]">
              {/* Image */}
              <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-[#111827] shadow-inner mb-6 relative">
                <div className="absolute inset-0 opacity-80 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>

              {/* Prerequisites */}
              <div className="px-1">
                <h4 className="text-[11px] font-bold text-gray-500 tracking-widest uppercase mb-3">
                  Prerequisites
                </h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3.5 py-1.5 bg-[#E0E7FF] text-[#4F46E5] text-[13px] font-semibold rounded-full">
                    Next.js Basics
                  </span>
                  <span className="px-3.5 py-1.5 bg-[#E0E7FF] text-[#4F46E5] text-[13px] font-semibold rounded-full">
                    Web APIs
                  </span>
                </div>

                {/* Button */}
                <button className="w-full py-4 bg-[#5452F6] hover:bg-[#4648D4] text-white rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(84,82,246,0.35)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#5452F6]/30"
                onClick={() => router.push("/practice/quiz/question")}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Start Quiz
                </button>

                {/* Disclaimer */}
                <p className="text-center text-[#6B7280] text-[12px] mt-4 px-2 leading-relaxed">
                  By clicking start, you agree to the <br />
                  <span className="underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-900 transition-colors">
                    Assessment Rules
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border border-dashed border-[#D1D5DB] rounded-[20px] p-5 bg-transparent">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="text-gray-500"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h4 className="text-[14px] font-bold text-gray-800">
                  Recent Activity
                </h4>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed pl-6">
                No previous attempts for this quiz.
                <br />
                Good luck on your first try!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
