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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]/40 focus-visible:ring-offset-1",
        // Hover scale effect
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        // State
        isSelected
          ? [
              "border-[#64748B] bg-gradient-to-br from-[#3B82F6]/12 to-[#3B82F6]/8",
              "text-[#3B82F6] shadow-[0_2px_12px_rgba(59, 130, 246,0.2)]",
            ]
          : [
              "border-[#E2E2EA] bg-white text-[#0F172A]",
              "hover:border-[#64748B]/50 hover:bg-[#F8F9FE] hover:text-[#2563EB]",
              "hover:shadow-[0_2px_8px_rgba(59, 130, 246,0.1)]",
            ],
      )}
    >
      {/* Icon wrapper with subtle color transition */}
      <span
        className={twMerge(
          "flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200",
          isSelected
            ? "bg-[#64748B]/15 text-[#64748B]"
            : "bg-[#F3F3F8] text-[#64748B] group-hover:bg-[#64748B]/10 group-hover:text-[#64748B]",
        )}
      >
        <Icon />
      </span>

      <span className="leading-none">{label}</span>

      {/* Selected checkmark */}
      {isSelected && (
        <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-[#64748B] shrink-0">
          <></>
        </span>
      )}
    </button>
  );
}
