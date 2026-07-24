import Link from "next/link";
import Image from "next/image";

export function QuizQuestionScreen() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      
      {/* ─── Topbar ────────────────────────────────────────────────────────── */}
      <header className="h-[72px] bg-white border-b border-[#F0F2F5] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        {/* Left: Close & Brand */}
        <div className="flex items-center gap-4">
          <Link href="/courses/quiz" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-[#3b3dbf] font-bold text-lg leading-tight">EduAI</span>
            <span className="text-gray-400 text-[11px] font-medium leading-tight">Next.js Advanced Patterns</span>
          </div>
        </div>

        {/* Right: Timer & User */}
        <div className="flex items-center gap-5">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-[#EEF2FF] text-[#6B6BFF] px-3.5 py-1.5 rounded-full shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-[13px] font-bold tracking-wide">12:45 remaining</span>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#6B6BFF] text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer">
            H
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-[760px] mx-auto px-6 pt-10">
          
          {/* Progress Section */}
          <div className="mb-8">
            <span className="text-[#6B6BFF] text-[11px] font-bold tracking-widest uppercase">Practice Module</span>
            <div className="flex items-end justify-between mt-1">
              <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">Question 3 of 10</h1>
              <span className="text-[13px] font-medium text-gray-500 mb-1">Completion: 30%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full mt-4 overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-[#6B6BFF] to-[#0891B2] rounded-full"></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-[#F3F4F6] mb-6">
            <p className="text-[17px] text-gray-800 font-medium leading-relaxed">
              What is the purpose of <code className="bg-[#EEF2FF] text-[#5452F6] px-2 py-0.5 rounded-md font-mono text-[15px]">Route Handlers</code> in Next.js?
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {/* Option A (Selected) */}
            <div className="flex items-center p-4 rounded-xl border-2 border-[#6B6BFF] bg-[#EEF2FF]/40 cursor-pointer transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#6B6BFF] text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-sm">
                A
              </div>
              <span className="ml-4 text-[15px] font-bold text-gray-900 flex-1">
                To create API endpoints
              </span>
              <div className="shrink-0 text-[#6B6BFF] ml-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
            </div>

            {/* Option B */}
            <div className="flex items-center p-4 rounded-xl border-2 border-[#F3F4F6] bg-white hover:border-gray-300 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] text-gray-500 flex items-center justify-center font-bold text-[15px] shrink-0">
                B
              </div>
              <span className="ml-4 text-[15px] font-medium text-gray-700 flex-1">
                To style components
              </span>
            </div>

            {/* Option C */}
            <div className="flex items-center p-4 rounded-xl border-2 border-[#F3F4F6] bg-white hover:border-gray-300 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] text-gray-500 flex items-center justify-center font-bold text-[15px] shrink-0">
                C
              </div>
              <span className="ml-4 text-[15px] font-medium text-gray-700 flex-1">
                To manage global state
              </span>
            </div>

            {/* Option D */}
            <div className="flex items-center p-4 rounded-xl border-2 border-[#F3F4F6] bg-white hover:border-gray-300 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] text-gray-500 flex items-center justify-center font-bold text-[15px] shrink-0">
                D
              </div>
              <span className="ml-4 text-[15px] font-medium text-gray-700 flex-1">
                To create database tables
              </span>
            </div>
          </div>

          {/* AI Tutor Hint */}
          <div className="mt-8 bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-sm flex gap-4 items-start">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2E3192] text-white flex items-center justify-center shrink-0 shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <div className="pt-0.5">
              <h4 className="text-[11px] font-bold text-[#6B6BFF] uppercase tracking-widest mb-1.5">AI Tutor Hint</h4>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Think about how Next.js handles requests that don't return HTML, but rather JSON or other data formats for external consumption.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* ─── Footer Action Bar ──────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#F0F2F5] py-4 px-6 z-20">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          
          {/* Left: Previous */}
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Previous
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <button className="text-[14px] font-bold text-[#6B6BFF] hover:text-[#4648D4] hover:underline transition-all">
              Skip for now
            </button>

            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5452F6] hover:bg-[#4648D4] text-white font-bold text-[14px] shadow-[0_4px_14px_rgba(84,82,246,0.35)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#5452F6]/30">
              Next Question
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
