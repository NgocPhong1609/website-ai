"use client";

import { useCallback } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { twMerge } from "tailwind-merge";
import type { MetricKey, HourlyDataPoint, DragRange } from "../../types";
import { METRIC_CONFIGS } from "../../constants";
import { useHourlyChart } from "../../hooks/useHourlyChart";
import { ChartLegend } from "./ChartLegend";
import { CustomTooltip } from "./CustomTooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HourlyChartProps {
  selectedMetrics: MetricKey[];
  data: HourlyDataPoint[];
  /** Called when user completes a drag-select on the chart */
  onRangeSelected?: (range: DragRange) => void;
  className?: string;
}

// ─── Axis Formatters ──────────────────────────────────────────────────────────

function formatHourTick(hour: number): string {
  return String(hour).padStart(2, "0");
}

function formatVolumeTick(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

function formatRateTick(value: number): string {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

// ─── Drag Select Banner ───────────────────────────────────────────────────────

function DragHint({ range }: { range: DragRange | null }) {
  if (!range) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF0FF] rounded-lg">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4648D4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="text-[11.5px] font-semibold text-[#4648D4]">
        Selected{" "}
        <strong>
          {String(range.startHour).padStart(2, "0")}:00 –{" "}
          {String(range.endHour).padStart(2, "0")}:59
        </strong>
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HourlyChart({
  selectedMetrics,
  data,
  onRangeSelected,
  className,
}: HourlyChartProps) {
  const {
    dragStart,
    dragEnd,
    isDragging,
    selectedRange,
    onDragStart,
    onDragMove,
    onDragEnd,
    clearSelection,
  } = useHourlyChart(onRangeSelected);

  // Separate metrics by type for dual-axis rendering
  const volumeMetrics = selectedMetrics.filter(
    (k) => METRIC_CONFIGS[k].type === "volume"
  );
  const rateMetrics = selectedMetrics.filter(
    (k) => METRIC_CONFIGS[k].type === "rate"
  );

  const hasRateAxis = rateMetrics.length > 0;
  const hasVolumeAxis = volumeMetrics.length > 0;

  // Build the chart title from selected metrics
  const chartTitle =
    selectedMetrics.length === 0
      ? "Select metrics above to plot"
      : selectedMetrics.map((k) => METRIC_CONFIGS[k].label).join(" / ") +
        " by hour";

  // Drag event handlers for Recharts
  const handleMouseDown = useCallback(
    (e: { activeLabel?: string | number }) => {
      if (e.activeLabel !== undefined) {
        onDragStart(Number(e.activeLabel));
      }
    },
    [onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: { activeLabel?: string | number }) => {
      if (e.activeLabel !== undefined && isDragging) {
        onDragMove(Number(e.activeLabel));
      }
    },
    [onDragMove, isDragging]
  );

  // Recharts ReferenceArea requires sorted x1/x2
  const refX1 =
    dragStart !== null && dragEnd !== null
      ? Math.min(dragStart, dragEnd)
      : undefined;
  const refX2 =
    dragStart !== null && dragEnd !== null
      ? Math.max(dragStart, dragEnd)
      : undefined;

  return (
    <div className={twMerge("bg-white rounded-2xl border border-[#EAEAF4] shadow-sm", className)}>
      {/* ── Card Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#F4F4FA]">
        <div className="flex flex-col gap-1">
          <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E] tracking-tight">
            {chartTitle}
          </h3>
          {selectedMetrics.length === 0 && (
            <p className="text-[11.5px] text-[#B0B0C8]">
              Click any metric card to add it to this chart (up to 3)
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ChartLegend selectedMetrics={selectedMetrics} />
          {selectedRange && (
            <DragHint range={selectedRange} />
          )}
          {selectedRange && (
            <button
              onClick={clearSelection}
              className="text-[11px] font-semibold text-[#9090B0] hover:text-[#464554] underline transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Chart Body ── */}
      <div className="px-2 pt-4 pb-3">
        {selectedMetrics.length === 0 ? (
          // Empty state
          <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-[#B0B0C8]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <p className="text-[12px] font-medium">No metrics selected</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={data}
              margin={{ top: 8, right: hasRateAxis ? 56 : 16, left: 8, bottom: 0 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              style={{ cursor: isDragging ? "col-resize" : "crosshair" }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#F0F0F8"
              />

              {/* X Axis */}
              <XAxis
                dataKey="hour"
                tickFormatter={formatHourTick}
                tick={{ fontSize: 11, fill: "#B0B0C8", fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: "#EAEAF4" }}
                interval={0}
              />

              {/* Left axis — volume metrics */}
              {hasVolumeAxis && (
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={formatVolumeTick}
                  tick={{ fontSize: 11, fill: "#B0B0C8", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
              )}

              {/* Right axis — rate metrics */}
              {hasRateAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={formatRateTick}
                  tick={{ fontSize: 11, fill: "#B0B0C8", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
              )}

              {/* Volume metrics → Bars on left axis */}
              {volumeMetrics.map((key) => {
                const cfg = METRIC_CONFIGS[key];
                return (
                  <Bar
                    key={key}
                    yAxisId="left"
                    dataKey={key}
                    fill={cfg.color}
                    fillOpacity={0.88}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                    isAnimationActive
                    animationDuration={400}
                  />
                );
              })}

              {/* Rate metrics → Lines on right axis */}
              {rateMetrics.map((key) => {
                const cfg = METRIC_CONFIGS[key];
                return (
                  <Line
                    key={key}
                    yAxisId="right"
                    dataKey={key}
                    stroke={cfg.color}
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: cfg.color, strokeWidth: 0 }}
                    activeDot={{ r: 4, stroke: "white", strokeWidth: 2, fill: cfg.color }}
                    type="monotone"
                    isAnimationActive
                    animationDuration={400}
                  />
                );
              })}

              {/* Drag selection overlay */}
              {isDragging && refX1 !== undefined && refX2 !== undefined && (
                <ReferenceArea
                  yAxisId={hasVolumeAxis ? "left" : "right"}
                  x1={refX1}
                  x2={refX2}
                  fill="#6366F1"
                  fillOpacity={0.12}
                  stroke="#6366F1"
                  strokeOpacity={0.4}
                  strokeWidth={1}
                />
              )}

              {/* Persisted selection area (after drag ends) */}
              {!isDragging && selectedRange && (
                <ReferenceArea
                  yAxisId={hasVolumeAxis ? "left" : "right"}
                  x1={selectedRange.startHour}
                  x2={selectedRange.endHour}
                  fill="#6366F1"
                  fillOpacity={0.07}
                  stroke="#6366F1"
                  strokeOpacity={0.3}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              )}

              <Tooltip
                content={
                  <CustomTooltip selectedMetrics={selectedMetrics} />
                }
                cursor={{ fill: "#F4F4FD", opacity: 0.7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Drag Hint Footer ── */}
      {selectedMetrics.length > 0 && !selectedRange && (
        <p className="text-center text-[10.5px] text-[#C0C0D8] pb-3 -mt-1 font-medium">
          ↔ Drag on chart to select a time range
        </p>
      )}
    </div>
  );
}
