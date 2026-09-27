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

// ─── Component ───────────────────────────────────────────────────────────────

export function TopicChip({
  label,
  iconKey,
  isSelected,
  onClick,
}: TopicChipProps) {
  const Icon = TOPIC_ICON_MAP[iconKey];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={twMerge(
        // Base
        "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium",
        "transition-all duration-200 ease-out cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-1",
        // Hover scale effect
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        // State
        isSelected
          ? [
              "border-slate-500 bg-gradient-to-br from-blue-500/12 to-blue-500/8",
              "text-blue-500 shadow-[0_2px_12px_rgba(59, 130, 246,0.2)]",
            ]
          : [
              "border-slate-200 bg-white text-slate-900",
              "hover:border-slate-500/50 hover:bg-slate-50 hover:text-blue-600",
              "hover:shadow-[0_2px_8px_rgba(59, 130, 246,0.1)]",
            ],
      )}
    >
      {/* Icon wrapper with subtle color transition */}
      <span
        className={twMerge(
          "flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200",
          isSelected
            ? "bg-slate-500/15 text-slate-500"
            : "bg-[#F3F3F8] text-slate-500 group-hover:bg-slate-500/10 group-hover:text-slate-500",
        )}
      >
        <Icon />
      </span>

      <span className="leading-none">{label}</span>

      {/* Selected checkmark */}
      {isSelected && (
        <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-slate-500 shrink-0">
          <></>
        </span>
      )}
    </button>
  );
}
