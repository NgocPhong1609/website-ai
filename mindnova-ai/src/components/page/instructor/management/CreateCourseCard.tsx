// ─── CreateCourseCard ─────────────────────────────────────────────────────────
// Placeholder card at the end of the grid — prompts instructor to create a new course.

import { PlusIcon } from "./icons";

export function CreateCourseCard() {
  return (
    <button
      id="btn-create-course-card"
      type="button"
      aria-label="Tạo khóa học mới"
      className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-white border-2 border-dashed border-[#D5D5F0] text-center p-8 hover:border-[#6B6BFF] hover:bg-[#F4F4FF] active:scale-98 transition-all duration-200 min-h-[200px]"
    >
      {/* Plus icon ring */}
      <div className="w-14 h-14 rounded-full border-2 border-[#D5D5F0] flex items-center justify-center text-[#B0B0C8] group-hover:border-[#6B6BFF] group-hover:text-[#6B6BFF] group-hover:bg-[#6B6BFF]/10 group-hover:scale-110 transition-all duration-200">
        <PlusIcon size={24} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-semibold text-[#64647A] group-hover:text-[#4648D4] transition-colors duration-150">
          Tạo khóa học mới
        </p>
        <p className="text-[12px] text-[#B0B0C8]">
          Bắt đầu hành trình chia sẻ kiến thức ngay hôm nay.
        </p>
      </div>
    </button>
  );
}
