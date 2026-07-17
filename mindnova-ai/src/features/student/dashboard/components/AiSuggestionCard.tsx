

// ─── Icons ────────────────────────────────────────────────────────────────────

import { AI_SUGGESTION } from "../constants";

function SparkleIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#4F46E5" />
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiSuggestionCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <SparkleIcon />

        <div className="flex-1 min-w-0 pt-0.5">
          {/* Badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] mb-2.5">
            {AI_SUGGESTION.badge}
          </span>

          {/* Message */}
          <p className="text-[16px] font-bold text-[#111827] leading-snug mb-3 pr-4">
            {AI_SUGGESTION.message}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-5 text-[13px] text-[#6B7280] mb-4">
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              Reason: {AI_SUGGESTION.reason}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              Estimated: {AI_SUGGESTION.estimated}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:ring-offset-1"
            >
              Review Now
            </button>
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#4F46E5] bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:ring-offset-1"
            >
              View Study Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
