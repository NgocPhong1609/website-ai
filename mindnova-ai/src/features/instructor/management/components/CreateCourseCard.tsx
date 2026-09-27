// ─── CreateCourseCard ─────────────────────────────────────────────────────────
// Minimalist create course card (Rule #7)

import Link from "next/link";
import { Plus } from "lucide-react";

export function CreateCourseCard() {
 return (
 <Link
 href="/instructor/create-course"
 id="btn-create-course-card"
 aria-label="Tạo khóa học mới"
 className="group flex flex-col items-center justify-center gap-4 rounded-lg bg-white border-2 border-dashed border-slate-300 hover:border-blue-600 text-center p-8 hover:bg-slate-50 active:scale-98 transition-all duration-200 min-h-[220px] cursor-pointer shadow-sm hover:shadow-sm"
 >
 <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-blue-600 group-hover:text-white group-hover:bg-blue-600 group-hover:scale-105 transition-all duration-200 shadow-sm">
 <Plus size={22} />
 </div>

 <div className="flex flex-col gap-1 max-w-[200px]">
 <p className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
 Tạo khóa học mới
 </p>
 <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
 Bắt đầu hành trình thiết kế bài giảng AI ngay hôm nay.
 </p>
 </div>
 </Link>
 );
}