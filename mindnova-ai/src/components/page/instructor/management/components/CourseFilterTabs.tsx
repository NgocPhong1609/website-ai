"use client";

// ─── CourseFilterTabs ─────────────────────────────────────────────────────────
// Filter tabs: Tất cả / Đang dạy / Bản nháp

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  TOTAL_COURSES,
  ACTIVE_COURSES,
  DRAFT_COURSES,
} from "../constants/data";

type FilterKey = "all" | "active" | "draft";

interface Tab {
  key: FilterKey;
  label: string;
  count: number;
}

const TABS: Tab[] = [
  { key: "all", label: "Tất cả", count: TOTAL_COURSES },
  { key: "active", label: "Đang dạy", count: ACTIVE_COURSES },
  { key: "draft", label: "Bản nháp", count: DRAFT_COURSES },
];

interface CourseFilterTabsProps {
  onFilterChange?: (key: FilterKey) => void;
}

export function CourseFilterTabs({ onFilterChange }: CourseFilterTabsProps) {
  const [active, setActive] = useState<FilterKey>("all");

  function handleSelect(key: FilterKey) {
    setActive(key);
    onFilterChange?.(key);
  }

  return (
    <div
      role="tablist"
      aria-label="Lọc khóa học"
      className="flex items-center gap-1 bg-[#F4F4FA] p-1 rounded-xl"
    >
      {TABS.map(({ key, label, count }) => {
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
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-white text-[#4648D4] shadow-sm shadow-[#4648D4]/10"
                : "text-[#64647A] hover:text-[#1A1A2E]",
            )}
          >
            {label}
            <span
              className={twMerge(
                "text-[11px] font-semibold px-1.5 py-0.5 rounded-md transition-colors duration-150",
                isActive
                  ? "bg-[#6B6BFF]/10 text-[#6B6BFF]"
                  : "bg-[#E8E8F4] text-[#9090B0]",
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
