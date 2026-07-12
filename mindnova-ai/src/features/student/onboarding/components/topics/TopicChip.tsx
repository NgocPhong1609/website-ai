"use client";

import { twMerge } from "tailwind-merge";
import type { TopicIconKey } from "@/src/features/student/onboarding/types";
import { TOPIC_ICON_MAP } from "./topicIcons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopicChipProps {
  label: string;
  iconKey: TopicIconKey;
  isSelected: boolean;
  onClick: () => void;
}

// ─── Color accent map per topic ───────────────────────────────────────────────

const TOPIC_COLORS: Record<TopicIconKey, { bg: string; icon: string; glow: string }> = {
  "html-css":      { bg: "from-[#FF6B35]/10 to-[#FF6B35]/5",  icon: "bg-[#FF6B35]/15 text-[#FF6B35]",  glow: "shadow-[0_4px_20px_rgba(255,107,53,0.25)]" },
  javascript:      { bg: "from-[#F7DF1E]/15 to-[#F7DF1E]/5",  icon: "bg-[#B8860B]/15 text-[#B8860B]",  glow: "shadow-[0_4px_20px_rgba(247,223,30,0.3)]" },
  typescript:      { bg: "from-[#3178C6]/10 to-[#3178C6]/5",  icon: "bg-[#3178C6]/15 text-[#3178C6]",  glow: "shadow-[0_4px_20px_rgba(49,120,198,0.25)]" },
  react:           { bg: "from-[#61DAFB]/10 to-[#61DAFB]/5",  icon: "bg-[#0EA5C9]/15 text-[#0EA5C9]",  glow: "shadow-[0_4px_20px_rgba(97,218,251,0.25)]" },
  nextjs:          { bg: "from-[#6B6BFF]/12 to-[#4648D4]/6",  icon: "bg-[#6B6BFF]/15 text-[#6B6BFF]",  glow: "shadow-[0_4px_20px_rgba(107,107,255,0.25)]" },
  nodejs:          { bg: "from-[#3C873A]/10 to-[#3C873A]/5",  icon: "bg-[#3C873A]/15 text-[#3C873A]",  glow: "shadow-[0_4px_20px_rgba(60,135,58,0.25)]" },
  database:        { bg: "from-[#EF4444]/10 to-[#EF4444]/5",  icon: "bg-[#EF4444]/15 text-[#EF4444]",  glow: "shadow-[0_4px_20px_rgba(239,68,68,0.2)]" },
  api:             { bg: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",  icon: "bg-[#8B5CF6]/15 text-[#8B5CF6]",  glow: "shadow-[0_4px_20px_rgba(139,92,246,0.25)]" },
  authentication:  { bg: "from-[#EC4899]/10 to-[#EC4899]/5",  icon: "bg-[#EC4899]/15 text-[#EC4899]",  glow: "shadow-[0_4px_20px_rgba(236,72,153,0.2)]" },
  "ui-ux":         { bg: "from-[#06B6D4]/10 to-[#06B6D4]/5",  icon: "bg-[#06B6D4]/15 text-[#06B6D4]",  glow: "shadow-[0_4px_20px_rgba(6,182,212,0.25)]" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function TopicChip({ label, iconKey, isSelected, onClick }: TopicChipProps) {
  const Icon = TOPIC_ICON_MAP[iconKey];
  const colors = TOPIC_COLORS[iconKey];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={twMerge(
        // Base layout
        "group relative flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold",
        "transition-all duration-200 ease-out cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B6BFF]/50 focus-visible:ring-offset-2",
        // Hover micro-lift
        "hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.97]",
        // Selected vs idle
        isSelected
          ? [
              `bg-gradient-to-br ${colors.bg} border-transparent`,
              colors.glow,
              "scale-[1.02]",
            ]
          : [
              "border-[#E2E2EA] bg-white text-[#464554]",
              "hover:border-[#6B6BFF]/40 hover:bg-[#F8F9FE]",
              "shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
              "hover:shadow-[0_4px_12px_rgba(107,107,255,0.1)]",
            ],
      )}
    >
      {/* Icon badge */}
      <span
        className={twMerge(
          "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 shrink-0",
          isSelected
            ? colors.icon
            : "bg-[#F3F3F8] text-[#84849A] group-hover:bg-[#EDEDF8] group-hover:text-[#6B6BFF]",
        )}
      >
        <Icon />
      </span>

      <span className={twMerge("leading-none", isSelected ? "text-[#131B2E]" : "")}>
        {label}
      </span>

      {/* Animated checkmark */}
      <span
        className={twMerge(
          "ml-auto flex items-center justify-center w-5 h-5 rounded-full shrink-0",
          "transition-all duration-200",
          isSelected
            ? "bg-[#6B6BFF] scale-100 opacity-100"
            : "bg-[#E8E8F0] scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-90",
        )}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path
            d="M1.5 4.5L3.5 6.5L7.5 2.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
