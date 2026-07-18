"use client";

import { useRef, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import type { MetricKey, CardState, HourlyDataPoint } from "../../types";
import { METRIC_CONFIGS } from "../../constants";
import { computeCardStats } from "../../hooks/useMetricCards";
import { MetricDropdown } from "./MetricDropdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  card: CardState;
  cardIndex: number;
  /** Metrics occupying ALL other card slots (for dropdown "in use" label) */
  usedMetrics: MetricKey[];
  data: HourlyDataPoint[];
  onSwap: (cardIndex: number, newMetric: MetricKey) => void;
  onToggleChart: (cardIndex: number) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between py-[3px]">
      <span className={twMerge("text-[11.5px] font-medium", className ?? "text-[#9090B0]")}>
        {label}
      </span>
      <span className={twMerge("text-[11.5px] font-bold tabular-nums", className ?? "text-[#464554]")}>
        {value}
      </span>
    </div>
  );
}

function HourStatRow({
  label,
  hour,
  value,
  labelColor,
}: {
  label: string;
  hour: number;
  value: string;
  labelColor: string;
}) {
  const hourStr = String(hour).padStart(2, "0") + ":00";
  return (
    <div className="flex items-center justify-between py-[3px]">
      <span className={twMerge("text-[11.5px] font-semibold", labelColor)}>
        {label}
      </span>
      <span className="text-[11.5px] font-bold tabular-nums text-[#464554]">
        <span className={twMerge("font-semibold", labelColor)}>{hourStr}</span>
        {" · "}
        {value}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MetricCard({
  card,
  cardIndex,
  usedMetrics,
  data,
  onSwap,
  onToggleChart,
}: MetricCardProps) {
  const { metricKey, isSelectedForChart } = card;
  const cfg = METRIC_CONFIGS[metricKey];
  const stats = computeCardStats(metricKey, data);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card body toggle
      setDropdownOpen((v) => !v);
    },
    []
  );

  const handleCardClick = useCallback(() => {
    onToggleChart(cardIndex);
  }, [onToggleChart, cardIndex]);

  const handleSwap = useCallback(
    (newMetric: MetricKey) => {
      onSwap(cardIndex, newMetric);
    },
    [onSwap, cardIndex]
  );

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelectedForChart}
        aria-label={`${cfg.label} metric card — click to toggle on chart`}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleCardClick();
        }}
        className={twMerge(
          // Base card styles
          "relative bg-white rounded-2xl border px-4 py-3.5 cursor-pointer",
          "transition-all duration-200 select-none focus:outline-none",
          "hover:shadow-md",
          // Selected state: colored ring border
          isSelectedForChart
            ? "shadow-[0_0_0_2px_var(--metric-color),0_4px_16px_rgba(0,0,0,0.08)]"
            : "border-[#EAEAF4] shadow-sm"
        )}
        style={
          {
            "--metric-color": cfg.color,
          } as React.CSSProperties
        }
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3">
          {/* Metric name button → opens dropdown */}
          <button
            ref={triggerRef}
            id={`metric-card-trigger-${cardIndex}`}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={handleTriggerClick}
            className={twMerge(
              "flex items-center gap-1 text-[12.5px] font-bold text-[#1A1A2E]",
              "rounded-md px-1 -ml-1 py-0.5",
              "hover:bg-[#F4F4FD] transition-colors focus:outline-none"
            )}
          >
            {cfg.label}
            {/* Chevron */}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={twMerge(
                "text-[#9090B0] transition-transform duration-150",
                dropdownOpen && "rotate-180"
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Metric color indicator dot */}
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: cfg.color }}
          />
        </div>

        {/* ── Stats rows ── */}
        <div className="flex flex-col gap-0">
          <StatRow label="Total" value={cfg.format(stats.total)} />
          <StatRow
            label="Avg/hour"
            value={cfg.format(stats.avgPerHour)}
          />
          <div className="border-t border-dashed border-[#F0F0F8] my-1" />
          <HourStatRow
            label="Best hour"
            hour={stats.bestHour.hour}
            value={cfg.format(stats.bestHour.value)}
            labelColor="text-emerald-500"
          />
          <HourStatRow
            label="Worst hour"
            hour={stats.worstHour.hour}
            value={cfg.format(stats.worstHour.value)}
            labelColor="text-rose-500"
          />
        </div>

        {/* Selected ring highlight (subtle inner glow) */}
        {isSelectedForChart && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 1.5px ${cfg.color}40`,
            }}
          />
        )}
      </div>

      {/* Portal dropdown */}
      {dropdownOpen && (
        <MetricDropdown
          activeMetric={metricKey}
          usedMetrics={usedMetrics}
          anchorEl={triggerRef.current}
          onSelect={handleSwap}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </>
  );
}
