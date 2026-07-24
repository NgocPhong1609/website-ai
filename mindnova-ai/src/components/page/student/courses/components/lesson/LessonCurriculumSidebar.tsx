export function LessonCurriculumSidebar() {
  return (
    <aside className="w-[300px] shrink-0 border-r border-[#F0F0F8] bg-white h-full overflow-y-auto hidden lg:block">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Next.js Fundamentals</h2>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="h-1.5 flex-1 bg-[#E8E8FF] rounded-full overflow-hidden mr-3">
              <div className="h-full bg-[#6B6BFF] rounded-full" style={{ width: "75%" }} />
            </div>
            <span className="text-xs font-semibold text-gray-500">75%</span>
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex flex-col space-y-1">
          {/* Item 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <svg className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-700">Introduction to Next.js</p>
              <p className="text-xs text-gray-500 mt-0.5">12m</p>
            </div>
          </div>

          {/* Item 2 - Active */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#EEF2FF] cursor-pointer">
            <svg className="w-5 h-5 text-[#6B6BFF] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#6B6BFF]">Route Handlers in Next.js</p>
              <p className="text-xs text-[#6B6BFF] mt-0.5">25m</p>
            </div>
          </div>

          {/* Item 3 - Locked */}
          <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
            <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-600">Server Components</p>
              <p className="text-xs text-gray-400 mt-0.5">30m</p>
            </div>
          </div>

          {/* Item 4 - Locked */}
          <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
            <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-600">Data Fetching Patterns</p>
              <p className="text-xs text-gray-400 mt-0.5">45m</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
