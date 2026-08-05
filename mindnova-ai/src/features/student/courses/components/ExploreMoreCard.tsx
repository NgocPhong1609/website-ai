import Link from "next/link";

export function ExploreMoreCard() {
  return (
    <Link
      href="/explore"
      className="group border-2 border-dashed border-[#CBD5E1] bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] rounded-2xl flex flex-col items-center justify-center p-6 text-center h-full hover:border-[#5052EE]/60 hover:bg-gradient-to-b hover:from-[#EEF2FF]/40 hover:to-[#F8FAFC] transition-all duration-300 text-decoration-none focus:outline-none"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-[#5052EE] group-hover:to-[#0D9488] group-hover:text-white transition-all duration-300 shadow-2xs group-hover:shadow-[0_4px_16px_rgba(80,82,238,0.3)] group-hover:scale-110 group-hover:rotate-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] mb-1.5 group-hover:text-[#5052EE] transition-colors">
        Khám phá thêm khoá học
      </h3>
      <p className="text-xs sm:text-sm font-normal text-[#64647A] max-w-[240px] mx-auto leading-relaxed">
        Mở rộng kỹ năng với danh mục đào tạo được Trợ lý AI thiết kế riêng cho lộ trình của bạn.
      </p>
      
      <div className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5052EE] bg-white px-4 py-2 rounded-xl border border-[#EAEAF4] shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#4648D4] group-hover:to-[#0D9488] group-hover:text-white group-hover:border-transparent transition-all duration-200">
        <span>Xem danh mục khoá học</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">➔</span>
      </div>
    </Link>
  );
}
