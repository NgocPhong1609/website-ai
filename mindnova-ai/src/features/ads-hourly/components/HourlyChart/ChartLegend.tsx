"use client";

import type { MetricKey } from "../../types";
import { METRIC_CONFIGS } from "../../constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartLegendProps {
  selectedMetrics: MetricKey[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChartLegend({ selectedMetrics }: ChartLegendProps) {
  if (selectedMetrics.length === 0) return null;

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {selectedMetrics.map((key) => {
        const cfg = METRIC_CONFIGS[key];
        return (
          <div key={key} className="flex items-center gap-1.5">
            {cfg.type === "volume" ? (
              /* Filled square → Bar */
              <span
                className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
            ) : (
              /* Circle with line → Line */
              <span className="flex items-center gap-0.5">
                <span
                  className="w-4 h-[2px] rounded-full shrink-0"
                  style={{ backgroundColor: cfg.color }}
                />
                <span
                  className="w-2 h-2 rounded-full border-2 shrink-0"
                  style={{ borderColor: cfg.color, backgroundColor: "white" }}
                />
                <span
                  className="w-4 h-[2px] rounded-full shrink-0"
                  style={{ backgroundColor: cfg.color }}
                />
              </span>
            )}
            <span className="text-[11.5px] font-semibold text-[#64647A]">
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
