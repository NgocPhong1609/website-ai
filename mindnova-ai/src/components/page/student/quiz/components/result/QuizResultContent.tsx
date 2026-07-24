export function QuizResultContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FB] min-h-full">
      <div className="max-w-[1000px] mx-auto px-6 py-8 pb-20">
        
        {/* ─── Top Section: Score & Insight ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Score Card */}
          <div className="md:col-span-2 bg-[#FAFBFF] rounded-[24px] border border-[#F0F2F5] shadow-sm relative overflow-hidden p-8 flex flex-col items-center justify-center">
            
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
               {/* Just a simple decorative diagonal gradient background to mimic the original */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[linear-gradient(45deg,transparent_45%,#E0E7FF_50%,transparent_55%,transparent_60%,#E0E7FF_65%,transparent_70%)] opacity-30 blur-sm"></div>
            </div>

            {/* Passed Badge */}
            <div className="absolute top-6 right-6 bg-[#2DD4BF] text-white px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
              </svg>
              Passed
            </div>

            <div className="relative z-10 text-center mt-4">
              <p className="text-[12px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Final Score</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[90px] font-bold text-[#5452F6] leading-none tracking-tighter">75</span>
                <span className="text-[32px] font-medium text-gray-400">/100</span>
              </div>
            </div>

            <div className="relative z-10 flex gap-20 mt-10 text-center">
              <div>
                <p className="text-[13px] font-bold text-gray-500 mb-1">Accuracy</p>
                <p className="text-[17px] font-bold text-gray-900">8 / 10 Correct</p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-500 mb-1">Time Taken</p>
                <p className="text-[17px] font-bold text-gray-900">7m 30s</p>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="md:col-span-1 bg-white rounded-[24px] border-2 border-[#EEF2FF] shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#5452F6] mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                <h3 className="font-bold text-[17px]">AI Insight</h3>
              </div>
              <p className="text-[15px] italic text-gray-600 leading-relaxed">
                "You understand the main idea of Route Handlers, but you still need more practice with error handling and response status codes."
              </p>
            </div>
            
            <div className="mt-8">
              <hr className="border-[#F3F4F6] mb-5" />
              <p className="text-[12px] font-bold text-gray-500 mb-1">AI Coach Suggestion</p>
              <p className="text-[14px] font-bold text-[#1F2937]">Focus on HTTP 4xx errors.</p>
            </div>
          </div>
        </div>

        {/* ─── Middle Section: Topic Performance ──────────────────────────────────── */}
        <div className="bg-white rounded-[24px] border border-[#F3F4F6] shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-8 mt-6">
          <h3 className="text-[20px] font-bold text-gray-900 mb-8">Topic Performance</h3>
          
          <div className="flex flex-col gap-8">
            {/* Topic 1 */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900">Basic concept</h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">Understanding API fundamentals</p>
                </div>
                <div className="bg-[#EEF2FF] text-[#5452F6] px-3.5 py-1.5 rounded-full text-[12px] font-bold">
                  Good (100%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-[#5452F6] to-[#4648D4] rounded-full"></div>
              </div>
            </div>

            {/* Topic 2 */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900">Route Handler syntax</h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">Defining GET, POST, and dynamic routes</p>
                </div>
                <div className="bg-[#EEF2FF] text-[#5452F6] px-3.5 py-1.5 rounded-full text-[12px] font-bold">
                  Good (85%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-[#5452F6] to-[#06B6D4] rounded-full"></div>
              </div>
            </div>

            {/* Topic 3 */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900">Error handling</h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">Try-catch blocks and status codes</p>
                </div>
                <div className="bg-[#FEE2E2] text-[#EF4444] px-3.5 py-1.5 rounded-full text-[12px] font-bold">
                  Needs Practice (40%)
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-gradient-to-r from-[#DC2626] to-[#EF4444] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Section: Action Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Card 1: Review Errors */}
          <div className="bg-[#EEF2FF]/60 rounded-[24px] p-6 border border-[#E0E7FF] transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h4 className="font-bold text-[17px] text-[#1F2937] mt-6 mb-2">Review Errors</h4>
            <p className="text-[13.5px] text-gray-500 leading-relaxed min-h-[44px]">
              Deep dive into the 3 questions you missed.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-[14px] font-bold text-[#5452F6] group-hover:gap-2.5 transition-all">
              Start Review 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 2: Extra Practice */}
          <div className="bg-[#EEF2FF]/60 rounded-[24px] p-6 border border-[#E0E7FF] transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] text-[#14B8A6] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 12.572L12 20.072 4.5 12.572a5.5 5.5 0 0 1 7.778-7.778l-.278.278.278-.278a5.5 5.5 0 0 1 7.778 7.778z"></path>
              </svg>
            </div>
            <h4 className="font-bold text-[17px] text-[#1F2937] mt-6 mb-2">Extra Practice</h4>
            <p className="text-[13.5px] text-gray-500 leading-relaxed min-h-[44px]">
              5 AI-generated questions focused on Error Handling.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-[14px] font-bold text-[#5452F6] group-hover:gap-2.5 transition-all">
              Practice More 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          {/* Card 3: Next Lesson */}
          <div className="bg-[#EEF2FF]/60 rounded-[24px] p-6 border border-[#E0E7FF] transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] text-[#5452F6] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <h4 className="font-bold text-[17px] text-[#1F2937] mt-6 mb-2">Next Lesson</h4>
            <p className="text-[13.5px] text-gray-500 leading-relaxed min-h-[44px]">
              Move forward to Middleware and Security.
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-[14px] font-bold text-[#5452F6] group-hover:gap-2.5 transition-all">
              Continue 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

        </div>

        {/* ─── Footer Buttons ────────────────────────────────────────────────────── */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button className="px-8 py-3.5 bg-[#5452F6] hover:bg-[#4648D4] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_14px_rgba(84,82,246,0.35)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#5452F6]/30">
            Back to Dashboard
          </button>
          <button className="px-8 py-3.5 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-[15px] shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-gray-100">
            Share Result
          </button>
        </div>

      </div>
    </div>
  );
}
