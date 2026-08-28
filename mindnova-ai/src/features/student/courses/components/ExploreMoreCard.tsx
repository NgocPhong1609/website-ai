import Link from "next/link";

export function ExploreMoreCard() {
 return (
 <Link
 href="/explore"
 className="group border border-dashed border-[#B8B0A3] bg-[#FEFCF9] rounded-xl flex flex-col items-center justify-center p-6 text-center h-full hover:border-[#C0392B] hover:bg-[#FAF7F2] transition-all duration-300 text-decoration-none focus:outline-none"
 >
 <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] text-[#2C3039] flex items-center justify-center mb-4 group-hover:bg-[#C0392B] group-hover:text-white transition-all duration-300 font-bold text-2xl font-[family-name:var(--font-playfair-display)]">
 +
 </div>
 
 <h3 className="text-base sm:text-lg font-bold text-[#2C3039] mb-1.5 group-hover:text-[#C0392B] transition-colors font-[family-name:var(--font-playfair-display)]">
 Khám phá thêm
 </h3>
 <p className="text-xs sm:text-sm font-normal text-[#8A8478] max-w-[240px] mx-auto leading-relaxed">
 Mở rộng kỹ năng với danh mục đào tạo được thiết kế riêng cho lộ trình của bạn.
 </p>
 
 <div className="mt-5 inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-[#2C3039] bg-white px-4 py-2 rounded-lg border border-[#E8E2D9] group-hover:bg-[#2C3039] group-hover:text-white group-hover:border-[#2C3039] transition-all duration-200">
 Xem danh mục khoá học
 </div>
 </Link>
 );
}
