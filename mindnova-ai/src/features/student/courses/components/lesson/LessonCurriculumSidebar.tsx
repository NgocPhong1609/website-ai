import { BookOpen, Check, Video } from "lucide-react";

export function LessonCurriculumSidebar() {
 return (
 <aside className="w-[300px] shrink-0 border-r border-[#E2E8F0] bg-white h-full overflow-y-auto hidden lg:block">
 <div className="p-6">
 <h2 className="text-lg font-bold text-[#0F172A] mb-4 font-serif">Next.js Fundamentals</h2>
 
 {/* Progress Bar */}
 <div className="mb-6">
 <div className="flex justify-between items-center mb-2">
 <div className="h-1.5 flex-1 bg-[#F1F5F9] rounded-full overflow-hidden mr-3 border border-[#E2E8F0]">
 <div className="h-full bg-[#0F172A] rounded-full" style={{ width: "75%" }} />
 </div>
 <span className="text-xs font-semibold text-[#64748B]">75%</span>
 </div>
 </div>

 {/* Lesson List */}
 <div className="flex flex-col space-y-2">
 {/* Item 1 - Completed */}
 <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors border border-transparent hover:border-[#E2E8F0]">
 <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-white bg-[#0F172A] border border-[#0F172A] rounded">
 <Check size={12} strokeWidth={2.5} aria-label="Đã hoàn thành" />
 </div>
 <div>
 <p className="text-sm font-semibold text-[#0F172A]">Introduction to Next.js</p>
 <p className="text-xs text-[#64748B] mt-0.5">12m</p>
 </div>
 </div>

 {/* Item 2 - Active */}
 <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#0F172A] cursor-pointer">
 <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px] bg-[#0F172A] border border-[#0F172A] rounded">
 <Video size={11} aria-label="Bài video" />
 </div>
 <div>
 <p className="text-sm font-semibold text-[#0F172A]">Route Handlers in Next.js</p>
 <p className="text-xs text-[#3B82F6] mt-0.5 font-bold uppercase tracking-wider">25m • Đang học</p>
 </div>
 </div>

 {/* Item 3 - Locked */}
 <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
 <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#64748B] bg-white border border-[#E2E8F0] rounded">
 <BookOpen size={11} aria-label="Bài đọc" />
 </div>
 <div>
 <p className="text-sm font-semibold text-[#64748B]">Server Components</p>
 <p className="text-xs text-[#64748B] mt-0.5">30m</p>
 </div>
 </div>

 {/* Item 4 - Locked */}
 <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
 <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[#64748B] bg-white border border-[#E2E8F0] rounded">
 <BookOpen size={11} aria-label="Bài đọc" />
 </div>
 <div>
 <p className="text-sm font-semibold text-[#64748B]">Data Fetching Patterns</p>
 <p className="text-xs text-[#64748B] mt-0.5">45m</p>
 </div>
 </div>
 </div>
 </div>
 </aside>
 );
}
