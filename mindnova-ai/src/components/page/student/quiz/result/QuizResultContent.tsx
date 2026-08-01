"use client";

import { useRouter } from "next/navigation";

export function QuizResultContent() {
  const router = useRouter();
  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F4F8] min-h-full">
      <div className="max-w-[1000px] mx-auto px-6 py-8 pb-20">
        {/* ─── Top Section: Score & Insight ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-2xs relative overflow-hidden p-8 flex flex-col items-center justify-center">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {/* Just a simple decorative diagonal gradient background to mimic the original */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[linear-gradient(45deg,transparent_45%,#E0E7FF_50%,transparent_55%,transparent_60%,#E0E7FF_65%,transparent_70%)] opacity-30 blur-sm"></div>
            </div>

            {/* Passed Badge */}
            <div className="absolute top-6 right-6 bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg>
              Passed
            </div>

            <div className="relative z-10 text-center mt-4">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#6B7280] uppercase mb-2">
                Final Score
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[84px] font-black text-[#4F46E5] leading-none tracking-tight">
                  75
                </span>
                <span className="text-[32px] font-medium text-gray-400">
                  /100
                </span>
              </div>
            </div>

            <div className="relative z-10 flex gap-20 mt-10 text-center">
              <div>
                <p className="text-[13px] font-bold text-gray-500 mb-1">
                  Accuracy
                </p>
                <p className="text-[17px] font-bold text-gray-900">
                  8 / 10 Correct
                </p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-500 mb-1">
                  Time Taken
                </p>
                <p className="text-[17px] font-bold text-gray-900">7m 30s</p>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#4F46E5] mb-6">
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
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                <h3 className="font-extrabold text-[#111827] text-lg">AI Insight</h3>
              </div>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                "You understand the main idea of Route Handlers, but you still
                need more practice with error handling and response status
                codes."
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-1">
                AI Coach Suggestion
              </p>
              <p className="text-sm font-extrabold text-[#111827]">
                Focus on HTTP 4xx errors.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Middle Section: Topic Performance ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-7 mt-6">
          <h3 className="text-lg font-extrabold text-[#111827] mb-6">
            Topic Performance
          </h3>

          <div className="flex flex-col gap-6">
            {/* Topic 1 */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-[#111827]">
                    Basic concept
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                    Understanding API fundamentals
                  </p>
                </div>
                <div className="bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] px-3 py-1 rounded-lg text-xs font-bold">
                  Good (100%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#4F46E5] rounded-full"></div>
              </div>
            </div>

            {/* Topic 2 */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-[#111827]">
                    Route Handler syntax
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                    Defining GET, POST, and dynamic routes
                  </p>
                </div>
                <div className="bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] px-3 py-1 rounded-lg text-xs font-bold">
                  Good (85%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-[#4F46E5] rounded-full"></div>
              </div>
            </div>

            {/* Topic 3 */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-[#111827]">
                    Error handling
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                    Try-catch blocks and status codes
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">
                  Needs Practice (40%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Section: Action Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Card 1: Review Errors */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all shadow-2xs hover:border-[#4F46E5] hover:shadow-sm cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
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
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h4 className="font-extrabold text-base text-[#111827] mt-5 mb-1.5">
                Review Errors
              </h4>
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                Deep dive into the 3 questions you missed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] group-hover:gap-2.5 transition-all uppercase tracking-wider">
              <span>Start Review</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 2: Extra Practice */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all shadow-2xs hover:border-emerald-500 hover:shadow-sm cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
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
                  <path d="M19.5 12.572L12 20.072 4.5 12.572a5.5 5.5 0 0 1 7.778-7.778l-.278.278.278-.278a5.5 5.5 0 0 1 7.778 7.778z"></path>
                </svg>
              </div>
              <h4 className="font-extrabold text-base text-[#111827] mt-5 mb-1.5">
                Extra Practice
              </h4>
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                5 AI-generated questions focused on Error Handling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:gap-2.5 transition-all uppercase tracking-wider">
              <span>Practice More</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 3: Next Lesson */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all shadow-2xs hover:border-[#4F46E5] hover:shadow-sm cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <h4 className="font-extrabold text-base text-[#111827] mt-5 mb-1.5">
                Next Lesson
              </h4>
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                Move forward to Middleware and Security.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] group-hover:gap-2.5 transition-all uppercase tracking-wider">
              <span>Continue</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* ─── Footer Buttons ────────────────────────────────────────────────────── */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold text-sm shadow-2xs transition-all cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
          <button className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm shadow-2xs transition-all cursor-pointer">
            Share Result
          </button>
        </div>
      </div>
    </div>
  );
}
