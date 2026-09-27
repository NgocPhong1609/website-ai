"use client";

import { ONBOARDING_TOPICS } from "@/src/features/student/onboarding/constants";
import { TopicChip } from "./TopicChip";
import type { ITopic } from "@/src/features/student/onboarding/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopicsGridProps {
 /** Set of currently selected topic IDs (controlled from parent). */
 selectedIds: ReadonlySet<number>;
 /** Called when a topic chip is toggled. */
 onToggle: (topic: ITopic) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Purely presentational grid of selectable topic chips.
 * All state is owned by the parent — this component is fully controlled.
 */
export function TopicsGrid({ selectedIds, onToggle }: TopicsGridProps) {
 const selectedCount = selectedIds.size;

 return (
 <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(59, 130, 246,0.04)]">
 {/* Header */}
 <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-slate-50 animate-pulse" />
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
 Chủ đề có sẵn
 </span>
 </div>
 {selectedCount > 0 && (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-blue-500 text-xs font-semibold">
 <></>
 {selectedCount} selected
 </span>
 )}
 </div>

 {/* Grid */}
 <div className="p-5">
 <div className="flex flex-wrap gap-2.5">
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
 <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
 Chọn tất cả chủ đề phù hợp. Càng nhiều lựa chọn, lộ trình càng chi tiết.
 </p>
 </div>
 </div>
 );
}
