export function LessonFooter() {
 return (
 <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F8] px-8 py-4 z-10">
 <div className="max-w-4xl mx-auto flex items-center justify-between">
 
 {/* Previous */}
 <button className="flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-gray-800 transition-colors">
 <></>
 Previous
 </button>

 {/* Center: Mark as Completed */}
 <button className="flex items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors ml-4 mr-auto border-l border-[#E2E8F0] pl-4">
 <></>
 Mark as Completed
 </button>

 {/* Right Actions */}
 <div className="flex items-center gap-3">
 <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#3B82F6] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
 Take Quiz
 </button>
 
 <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3B82F6] shadow-[0_4px_12px_rgba(59, 130, 246,0.3)] hover:shadow-[0_6px_16px_rgba(59, 130, 246,0.4)] hover:-translate-y-0.5 transition-all">
 Next Lesson
 <></>
 </button>
 </div>

 </div>
 </div>
 );
}
