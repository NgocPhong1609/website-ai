export function DashboardContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FB] min-h-full">
      <div className="max-w-[1100px] mx-auto p-6 lg:p-8 pb-20">
        
        {/* ─── Banner ────────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#D6FAFF] via-[#E2E8FF] to-[#E9DDFF] rounded-[24px] p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-sm border border-white/50">
          <div className="relative z-10">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#1F2937] leading-tight tracking-tight">
              Fantastic work, Hieu!
            </h1>
            <p className="text-[15px] text-[#4B5563] mt-2 font-medium">
              You've just leveled up your Next.js skills. Keep that streak alive!
            </p>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-0">
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-2 shadow-md shadow-teal-200/50 hover:scale-105 transition-transform cursor-default">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              3 Day Streak!
            </div>
          </div>
        </div>

        {/* ─── Main Grid ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Smart Next Step */}
            <div className="bg-gradient-to-br from-[#DFE6F1] to-[#CFDAE9] rounded-[24px] p-6 lg:p-8 relative shadow-sm border border-white/40">
              
              <div className="absolute top-6 right-6 bg-[#D8DFFF]/80 backdrop-blur-sm text-[#5452F6] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                MindNova AI Suggestion
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start mt-8 md:mt-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#2E3192] rounded-[18px] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/20">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-[22px] text-[#1F2937] leading-tight">Smart Next Step</h3>
                  <p className="text-[15px] text-[#4B5563] mt-2 leading-relaxed max-w-lg">
                    Great progress! You passed the Route Handlers quiz. Next, you should continue with 'Server Actions' to master data mutations.
                  </p>
                  <button className="mt-6 bg-[#5452F6] hover:bg-[#4648D4] text-white px-6 py-3 rounded-[14px] font-bold text-[14px] flex items-center gap-2 shadow-[0_4px_14px_rgba(84,82,246,0.3)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-[#5452F6]/30">
                    Continue Next Lesson
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Overall Progress */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F0F2F5] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">Overall Progress</h4>
                  <span className="text-[#5452F6] font-bold text-[14px]">+4% increase</span>
                </div>
                
                <div className="mt-6 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[56px] font-bold text-[#5452F6] leading-none tracking-tighter">68%</span>
                    <span className="text-[13px] font-semibold text-gray-400">Total Completion</span>
                  </div>
                </div>

                <div>
                  <p className="text-[12px] font-medium text-gray-500 mb-2">+4% from your last session</p>
                  <div className="h-2.5 w-full bg-[#EEF2FF] rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-[#5452F6] to-[#06B6D4] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F0F2F5]">
                <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-6">Recent Activity</h4>
                
                <div className="flex flex-col gap-6">
                  {/* Item 1 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#1F2937]">Just now</p>
                      <p className="text-[13px] text-gray-500 mt-0.5">Completed Quiz: Route Handlers</p>
                      <div className="bg-[#EEF2FF] text-[#5452F6] text-[11px] font-bold px-2.5 py-0.5 rounded-md mt-2 w-fit">
                        Score: 75/100
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#1F2937]">Yesterday</p>
                      <p className="text-[13px] text-gray-500 mt-0.5">Watched 'Dynamic Routing' (12m)</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Narrower) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Focus Areas */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F0F2F5]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="text-[#06B6D4]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <h3 className="font-bold text-[18px] text-[#1F2937]">Focus Areas</h3>
              </div>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                AI detected these topics need more attention:
              </p>

              <div className="flex flex-col gap-3">
                {/* Alert Area */}
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[16px] p-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="font-bold text-[14px] text-[#DC2626]">Error Handling</h4>
                    <span className="bg-[#DC2626] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Needs Practice
                    </span>
                  </div>
                  <p className="text-[12px] text-[#991B1B] leading-relaxed">
                    Missed 2 questions in the last quiz. Review error boundaries.
                  </p>
                </div>

                {/* Normal Area */}
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[16px] p-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="font-bold text-[14px] text-[#334155]">Middleware Logic</h4>
                    <span className="text-[11px] font-semibold text-gray-400">
                      Low Mastery
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] leading-relaxed">
                    Last practiced 4 days ago. Needs refresh.
                  </p>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl border-2 border-[#E0E7FF] text-[#5452F6] font-bold text-[14px] hover:bg-[#EEF2FF] transition-colors focus:outline-none focus:ring-4 focus:ring-[#EEF2FF]">
                Personalized Practice
              </button>
            </div>

            {/* Badges Earned */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F0F2F5]">
              <h4 className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-5">Badges Earned</h4>
              
              <div className="flex gap-4">
                {/* Badge 1 */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2DD4BF] to-[#0F766E] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(45,212,191,0.3)] hover:scale-110 transition-transform cursor-pointer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                    <path d="M7 4h10"></path>
                    <path d="M17 4v8a5 5 0 0 1-10 0V4"></path>
                    <path d="M7 8H4.5A2.5 2.5 0 0 1 2 5.5v0A2.5 2.5 0 0 1 4.5 3H7"></path>
                    <path d="M17 8h2.5A2.5 2.5 0 0 0 22 5.5v0A2.5 2.5 0 0 0 19.5 3H17"></path>
                  </svg>
                </div>
                
                {/* Badge 2 */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#818CF8] to-[#4338CA] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(129,140,248,0.3)] hover:scale-110 transition-transform cursor-pointer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>

                {/* Badge 3 (Locked) */}
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
