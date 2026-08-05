"use client";

// ─── CourseFilterTabs ─────────────────────────────────────────────────────────
// Filter tabs with minimalist Rule #7 styles: Tất cả / Đang dạy / Bản nháp

import { useState } from "react";
import { twMerge } from "tailwind-merge";
type FilterKey = "all" | "active" | "draft";

interface Tab {
  key: FilterKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Đang dạy" },
  { key: "draft", label: "Bản nháp" },
];

interface CourseFilterTabsProps {
  counts: { all: number; active: number; draft: number };
  onFilterChange?: (key: FilterKey) => void;
}

export function CourseFilterTabs({ counts, onFilterChange }: CourseFilterTabsProps) {
  const [active, setActive] = useState<FilterKey>("all");

  function handleSelect(key: FilterKey) {
    setActive(key);
    onFilterChange?.(key);
  }

  return (
    <div
      role="tablist"
      aria-label="Lọc khóa học"
      className="flex items-center gap-1.5 bg-white border border-gray-200 p-1.5 rounded-xl shadow-2xs shrink-0"
    >
      {TABS.map(({ key, label }) => {
        const count = counts[key] || 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            id={`tab-${key}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => handleSelect(key)}
            className={twMerge(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer",
              isActive
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50",
            )}
          >
            <span>{label}</span>
            <span
              className={twMerge(
                "text-[11px] font-extrabold px-1.5 py-0.5 rounded-md transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-[#6B7280]",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}