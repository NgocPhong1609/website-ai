import { AI_SUGGESTION } from "@features/student/dashboard/constants/data";

import Link from "next/link";
import { AI_SUGGESTION } from "../constants";
import type { AiSuggestion } from "../types";
import { Card } from "@/src/shared/components";

function SparkleIcon() {
  return (
    <div className="group/icon relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] p-0.5 flex items-center justify-center shrink-0 shadow-[0_6px_20px_rgba(107,107,255,0.3)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#4648D4] group-hover/icon:bg-transparent group-hover/icon:text-white transition-colors duration-200">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-ring-breathe">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 transition-transform duration-200">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

interface AiSuggestionCardProps {
  suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion = AI_SUGGESTION }: AiSuggestionCardProps) {
  return (
    <Card aria-label="AI Learning Suggestion" variant="default" hoverEffect="glow" padding="md" className="group border-[#E8E8F2] w-full">
      {/* Delicate left accent glow */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#4CD7F6] via-[#6B6BFF] to-[#4648D4]" />

      <div className="flex flex-col sm:flex-row items-start gap-5 pl-1">
        <SparkleIcon />

        <div className="flex-1 min-w-0">
          {/* Badge & Header */}
          <div className="flex flex-wrap items-center gap-3 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4648D4] text-xs font-semibold tracking-wide uppercase border border-[#6B6BFF]/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] absolute" />
              {suggestion.badge}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F6FB] text-xs font-medium text-[#64647A] border border-[#EAEAF4]">
              ⏱️ Est: {suggestion.estimated}
            </span>
          </div>

          {/* Message */}
          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] tracking-tight leading-snug mb-2 group-hover:text-[#4648D4] transition-colors duration-200">
            {suggestion.message}
          </h3>

          {/* Reason */}
          <div className="flex items-start gap-2 text-xs sm:text-sm text-[#64647A] mb-5 bg-[#F6F6FB]/80 p-3 rounded-xl border border-[#EAEAF4]/70">
            <span className="text-[#6B6BFF] font-semibold shrink-0">💡 AI Insight:</span>
            <span className="leading-relaxed text-[#1A1A2E]/85">{suggestion.reason}</span>
          </div>

          {/* Action buttons with engaging interactive micro-animations */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/courses/lesson"
              className="group/btn inline-flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_16px_rgba(107,107,255,0.35)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
            >
              <span>Review Lesson Now</span>
              <ArrowRightIcon />
            </Link>

            <Link
              href="/study-plan"
              className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#64647A] hover:text-[#4648D4] bg-white hover:bg-[#F4F4FA] border border-[#EAEAF4] hover:border-[#6B6BFF]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/20"
            >
              Configure AI Goals
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}







