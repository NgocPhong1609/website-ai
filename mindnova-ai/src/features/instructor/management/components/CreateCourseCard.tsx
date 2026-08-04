// ─── CreateCourseCard ─────────────────────────────────────────────────────────
// Minimalist create course card (Rule #7)

import Link from "next/link";
import { PlusIcon } from "./icons";

export function CreateCourseCard() {
  return (
    <Link
      href="/instructor/create-course"
      id="btn-create-course-card"
      aria-label="Tạo khóa học mới"
      className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-[#4F46E5] text-center p-8 hover:bg-[#EEF2FF]/40 active:scale-98 transition-all duration-200 min-h-[220px] cursor-pointer shadow-2xs hover:shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#6B7280] group-hover:border-[#4F46E5] group-hover:text-white group-hover:bg-[#4F46E5] group-hover:scale-105 transition-all duration-200 shadow-2xs">
        <PlusIcon size={22} />
      </div>

      <div className="flex flex-col gap-1 max-w-[200px]">
        <p className="text-[15px] font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
          Tạo khóa học mới
        </p>
        <p className="text-[12px] text-[#6B7280] font-medium leading-relaxed">
          Bắt đầu hành trình thiết kế bài giảng AI ngay hôm nay.
        </p>
      </div>
    </Link>
  );
}