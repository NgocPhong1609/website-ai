export function LessonCurriculumSidebar() {
 return (
 <aside className="w-[300px] shrink-0 border-r border-[#E8E2D9] bg-white h-full overflow-y-auto hidden lg:block">
 <div className="p-6">
 <h2 className="text-lg font-bold text-[#2C3039] mb-4 font-[family-name:var(--font-playfair-display)]">Next.js Fundamentals</h2>
 
 {/* Progress Bar */}
 <div className="mb-6">
 <div className="flex justify-between items-center mb-2">
 <div className="h-1.5 flex-1 bg-[#F5F0E8] rounded-full overflow-hidden mr-3 border border-[#E8E2D9]">
 <div className="h-full bg-[#2C3039] rounded-full" style={{ width: "75%" }} />
 </div>
 <span className="text-xs font-semibold text-[#8A8478]">75%</span>
 </div>
 </div>

 {/* Lesson List */}
 <div className="flex flex-col space-y-2">
 {/* Item 1 - Completed */}
 <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF7F2] cursor-pointer transition-colors border border-transparent hover:border-[#E8E2D9]">
 
 <div>
 <p className="text-sm font-semibold text-[#2C3039]">Introduction to Next.js</p>
 <p className="text-xs text-[#8A8478] mt-0.5">12m</p>
 </div>
 </div>

 {/* Item 2 - Active */}
 <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FEFCF9] border border-[#2C3039] cursor-pointer">
 <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px] bg-[#2C3039] border border-[#2C3039] rounded">
 ▶
 </div>
 <div>
 <p className="text-sm font-semibold text-[#2C3039]">Route Handlers in Next.js</p>
 <p className="text-xs text-[#C0392B] mt-0.5 font-bold uppercase tracking-wider">25m • Đang học</p>
 </div>
 </div>

 {/* Item 3 - Locked */}
 <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
 
 <div>
 <p className="text-sm font-semibold text-[#8A8478]">Server Components</p>
 <p className="text-xs text-[#8A8478] mt-0.5">30m</p>
 </div>
 </div>

 {/* Item 4 - Locked */}
 <div className="flex items-start gap-3 p-3 rounded-xl cursor-not-allowed opacity-60">
 
 <div>
 <p className="text-sm font-semibold text-[#8A8478]">Data Fetching Patterns</p>
 <p className="text-xs text-[#8A8478] mt-0.5">45m</p>
 </div>
 </div>
 </div>
 </div>
 </aside>
 );
}
