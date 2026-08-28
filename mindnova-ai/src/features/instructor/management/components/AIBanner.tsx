// ─── AIBanner ─────────────────────────────────────────────────────────────────
// Promotional AI banner at the top of the course management page (Minimalist Rule #7)

import Link from "next/link";
import { SparklesIcon } from "./icons";

export function AIBanner() {
 return (
 <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E8E2D9] p-6 flex items-center justify-between shadow-2xs">
 {/* Left content */}
 <div className="relative z-10 flex flex-col gap-3 max-w-lg">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#C0392B] text-xs font-bold w-fit border -[#FAF7F2]">
 <SparklesIcon />
 <span>MindNova AI Assistant</span>
 </div>
 <h2 className="text-[#2C3039] font-extrabold text-xl tracking-tight">
 Hỗ trợ AI: Sinh đề cương tự động
 </h2>
 <p className="text-[#8A8478] text-sm leading-relaxed font-medium">
 Sử dụng Trí tuệ Nhân tạo để tự động tạo cấu trúc chương học logic và toàn diện dựa trên tiêu đề khóa học chỉ trong vài giây.
 </p>
 <Link
 id="btn-ai-banner-cta"
 href="/instructor/create-course"
 className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#C0392B] hover:bg-[#4338CA] active:bg-[#3730A3] shadow-2xs hover:shadow-sm transition-all duration-150 w-fit cursor-pointer"
 >
 <SparklesIcon />
 <span>Thử ngay bây giờ</span>
 </Link>
 </div>

 {/* Right decorative graphic (Minimalist Indigo) */}
 
 </div>
 );
}