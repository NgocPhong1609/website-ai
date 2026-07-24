"use client";

import type { MetricKey } from "../../types";
import { METRIC_CONFIGS } from "../../constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PayloadEntry {
  dataKey?: string | number;
  value?: number | string | (number | string)[];
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: number | string;
  selectedMetrics: MetricKey[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomTooltip({
  active,
  payload,
  label,
  selectedMetrics,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const hourStr = String(label).padStart(2, "0") + ":00";

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#EAEAF4] px-4 py-3 min-w-[160px] pointer-events-none">
      {/* Hour label */}
      <p className="text-[10px] font-bold text-[#9090B0] uppercase tracking-widest mb-2">
        Hour {hourStr}
      </p>

      <div className="flex flex-col gap-1.5">
        {selectedMetrics.map((key) => {
          const cfg = METRIC_CONFIGS[key];
          const entry = payload.find((p: PayloadEntry) => p.dataKey === key);
          if (!entry) return null;
          const value = typeof entry.value === "number" ? entry.value : 0;

          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {/* Icon shape: square for volume, circle for rate */}
                {cfg.type === "volume" ? (
                  <span
                    className="w-2 h-2 rounded-[2px] shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full border-2 shrink-0"
                    style={{ borderColor: cfg.color, backgroundColor: "white" }}
                  />
                )}
                <span className="text-[11.5px] font-semibold text-[#64647A]">
                  {cfg.label}
                </span>
              </div>
              <span
                className="text-[12px] font-extrabold tabular-nums"
                style={{ color: cfg.color }}
              >
                {cfg.format(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
