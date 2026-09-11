import Link from "next/link";

export function ExploreMoreCard() {
 return (
 <Link
 href="/explore"
 className="border border-dashed border-slate-300 bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center h-full hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 text-decoration-none focus:outline-none"
 >
 <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all duration-300 font-bold text-2xl">
 +
 </div>
 
 <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 transition-colors">
 Khám phá thêm
 </h3>
 <p className="text-xs sm:text-sm font-normal text-slate-500 max-w-[240px] mx-auto leading-relaxed">
 Mở rộng kỹ năng với danh mục đào tạo được thiết kế riêng cho lộ trình của bạn.
 </p>
 
 <div className="mt-5 inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all duration-300">
 Xem danh mục khoá học
 </div>
 </Link>
 );
}
