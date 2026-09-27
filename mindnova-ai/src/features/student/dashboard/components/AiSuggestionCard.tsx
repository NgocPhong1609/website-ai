import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { AI_SUGGESTION } from "../constants";
import type { AiSuggestion } from "../types";

interface AiSuggestionCardProps {
  suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion = AI_SUGGESTION }: AiSuggestionCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 w-full group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300">
          <Sparkles size={22} className="animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Badge & Metadata Header */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-indigo-700 text-xs font-bold border border-indigo-200 shadow-sm uppercase tracking-wide">
              Gợi ý từ Trợ lý AI Nova
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm text-xs font-medium text-slate-600 border border-slate-200">
              Thời gian: {suggestion?.estimated || "15 phút"}
            </span>
          </div>

          {/* Message Content */}
          <p className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-relaxed transition-colors duration-200">
            {suggestion?.message || "Chúng tôi nhận thấy bạn vừa dành 20 phút xử lý vướng mắc về Hydration errors. Hãy thử ôn tập chuyên sâu học phần Server vs Client Leaf Node Components nhé!"}
          </p>

          <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium bg-white/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white shadow-sm">
            <span className="text-indigo-600 font-bold shrink-0">Lý do đề xuất:</span>
            <span className="leading-relaxed">{suggestion?.reason || "Điểm kiểm tra kỹ năng State & Client Components lần trước là 58%."}</span>
          </div>

          {/* Compact Interactive Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={suggestion?.action_url || "/courses/lesson"}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-blue-500/25 border border-transparent"
            >
              <span>{suggestion?.action_text || "Vào bài ôn tập ngay"}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/study-plan"
              className="py-3 px-5 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all shadow-sm"
            >
              Nhờ AI hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
