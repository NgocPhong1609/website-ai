import React from "react";
import Link from "next/link";

export function ExploreMoreCard() {
  return (
    <Link
      href="/explorer"
      className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white hover:border-[#4F46E5] hover:bg-indigo-50/20 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center h-full min-h-[420px] shadow-2xs group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center mb-5 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-sm group-hover:scale-105">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      
      <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-[#4F46E5] transition-colors">
        Khám Phá Khóa Học Mới
      </h3>
      <p className="text-xs text-gray-500 max-w-[250px] mx-auto leading-relaxed font-semibold">
        Tìm kiếm thử thách tiếp theo và mở rộng kỹ năng trong danh mục khóa học được AI đề xuất cho bạn.
      </p>

      <div className="mt-6 px-5 py-2.5 rounded-xl bg-gray-100 group-hover:bg-[#4F46E5] group-hover:text-white text-gray-700 text-xs font-extrabold transition-all shadow-2xs uppercase tracking-wider">
        Duyệt Khung Chương Trình ➔
      </div>
    </Link>
  );
}
