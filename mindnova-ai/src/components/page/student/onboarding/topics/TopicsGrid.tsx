"use client";

import { ONBOARDING_TOPICS } from "@/src/components/page/student/onboarding/constants";
import { TopicChip } from "./TopicChip";
import type { ITopic } from "@/src/components/page/student/onboarding/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopicsGridProps {
  /** Set of currently selected topic IDs (controlled from parent). */
  selectedIds: ReadonlySet<number>;
  /** Called when a topic chip is toggled. */
  onToggle: (topic: ITopic) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Purely presentational grid of selectable topic cards.
 * All state is owned by the parent — this component is fully controlled.
 */
export function TopicsGrid({ selectedIds, onToggle }: TopicsGridProps) {
  const selectedCount = selectedIds.size;

  return (
    <div className="flex-1 bg-white/70 backdrop-blur-sm border border-[#E8E8F0] rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_32px_rgba(107,107,255,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F7] bg-gradient-to-r from-white to-[#F8F8FF]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B6BFF] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B6BFF]" />
          </span>
          <span className="text-xs font-bold text-[#84849A] uppercase tracking-[0.12em]">
            Available Topics
          </span>
        </div>

        {/* Selection counter pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
            selectedCount > 0
              ? "bg-[#6B6BFF] text-white shadow-[0_2px_10px_rgba(107,107,255,0.35)]"
              : "bg-[#F0F0F7] text-[#ADADC0]"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {selectedCount > 0 ? `${selectedCount} selected` : "0 selected"}
        </div>
      </div>

      {/* Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2.5">
          {ONBOARDING_TOPICS.map((topic) => (
            <TopicChip
              key={topic.id}
              label={topic.label}
              iconKey={topic.iconKey}
              isSelected={selectedIds.has(topic.id)}
              onClick={() => onToggle(topic)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-[11px] text-[#ADADC0] leading-relaxed text-center">
          Select all that apply — more selections = richer AI pathways.
        </p>
      </div>
    </div>
  );
}
