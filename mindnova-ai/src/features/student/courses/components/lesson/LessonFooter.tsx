export function LessonFooter() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F8] px-8 py-4 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Previous */}
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Previous
        </button>

        {/* Center: Mark as Completed */}
        <button className="flex items-center gap-2 text-sm font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors ml-4 mr-auto border-l border-gray-200 pl-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Mark as Completed
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF] hover:bg-[#EEF2FF] transition-colors">
            Take Quiz
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_12px_rgba(107,107,255,0.3)] hover:shadow-[0_6px_16px_rgba(107,107,255,0.4)] hover:-translate-y-0.5 transition-all">
            Next Lesson
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
