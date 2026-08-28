import Link from "next/link";
import { AI_SUGGESTION } from "../constants";
import type { AiSuggestion } from "../types";

interface AiSuggestionCardProps {
 suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion = AI_SUGGESTION }: AiSuggestionCardProps) {
 return (
 <div className="group relative overflow-hidden rounded-xl bg-white border border-[#E8E2D9] p-5 hover:border-[#B8B0A3] transition-all duration-300 w-full">
 <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
 <div className="w-11 h-11 rounded-xl bg-[#2C3039] text-white flex items-center justify-center shrink-0 text-sm font-bold font-[family-name:var(--font-playfair-display)]">
 AI
 </div>

 <div className="flex-1 min-w-0 space-y-2.5">
 {/* Badge & Metadata Header */}
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF7F2] text-[#C0392B] text-xs font-semibold border border-[#E8E2D9]">
 Gợi ý từ Trợ lý AI Nova
 </span>
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-xs font-medium text-[#8A8478] border border-[#E8E2D9]">
 Thời gian: 15 phút
 </span>
 </div>
 <span className="text-[11px] font-semibold text-[#2C3039] bg-[#E8F6F3] px-2.5 py-0.5 rounded-full border border-[#2C3039]/20">
 Chẩn đoán thời gian thực
 </span>
 </div>

 {/* Message Content */}
 <p className="text-sm sm:text-base font-bold text-[#2C3039] tracking-tight leading-snug group-hover:text-[#C0392B] transition-colors duration-200 font-[family-name:var(--font-playfair-display)]">
 {suggestion?.message || "Chúng tôi nhận thấy bạn vừa dành 20 phút xử lý vướng mắc về Hydration errors. Hãy thử ôn tập chuyên sâu học phần Server vs Client Leaf Node Components nhé!"}
 </p>

 <div className="flex items-center gap-2 text-xs text-[#8A8478] font-normal italic bg-[#FAF7F2] px-3 py-2 rounded-lg border border-[#E8E2D9]">
 <span className="text-[#C0392B] font-semibold not-italic">Lý do đề xuất:</span>
 <span>{suggestion?.reason || "Điểm kiểm tra kỹ năng State & Client Components lần trước là 58%."}</span>
 </div>

 {/* Compact Interactive Actions */}
 <div className="flex flex-wrap items-center gap-3 pt-1">
 <Link
 href={suggestion?.action_url || "/courses/lesson"}
 className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] hover:-translate-y-0.5 transition-all duration-200 text-decoration-none"
 >
 <span>{suggestion?.action_text || "Vào bài ôn tập ngay"}</span>
 </Link>

 <Link
 href="/study-plan"
 className="py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-[#8A8478] hover:text-[#2C3039] bg-white hover:bg-[#F5F0E8] border border-[#E8E2D9] hover:border-[#B8B0A3] transition-all text-decoration-none"
 >
 Cấu hình mục tiêu AI
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
