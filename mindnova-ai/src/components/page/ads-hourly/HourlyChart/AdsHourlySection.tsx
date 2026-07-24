"use client";

// ─── AdsHourlySection ─────────────────────────────────────────────────────────
// Composes MetricCards + HourlyChart into one self-contained section.
// Consumers pass an optional `onRangeSelected` callback to react to
// drag-selected hour ranges on the chart.

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useMetricCards, computeCardStats } from "@/src/hooks/useMetricCards";
import { useHourlyChart } from "@/src/hooks/useHourlyChart";
import type { DragRange, MetricKey } from "@/src/types";
import { METRIC_CONFIGS, MOCK_HOURLY_DATA } from "@/src/constants/ads-hourly";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AdsHourlySectionProps {
  data?: typeof MOCK_HOURLY_DATA;
  onRangeSelected?: (range: DragRange) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatHour(hour: number): string {
  if (hour === 0) return "12am";
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return "12pm";
  return `${hour - 12}pm`;
}

function getConfigByKey(key: MetricKey) {
  return METRIC_CONFIGS.find((c) => c.key === key)!;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  metricKey: MetricKey;
  isSelected: boolean;
  onToggle: () => void;
  data: typeof MOCK_HOURLY_DATA;
}

function MetricCard({ metricKey, isSelected, onToggle, data }: MetricCardProps) {
  const config = getConfigByKey(metricKey);
  const stats = useMemo(() => computeCardStats(metricKey, data), [metricKey, data]);

  return (
    <button
      onClick={onToggle}
      aria-pressed={isSelected}
      className={[
        "relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5",
        isSelected
          ? "border-transparent shadow-lg ring-2"
          : "border-[#EAEAF4] bg-white hover:border-[#C5C5EB]",
      ].join(" ")}
      style={
        isSelected
          ? { background: `${config.color}18`, outline: `2px solid ${config.color}`, outlineOffset: "1px" }
          : {}
      }
    >
      {/* Color dot + label */}
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: config.color }}
        />
        <span className="text-xs font-semibold text-[#64647A] uppercase tracking-wide">
          {config.label}
        </span>
        {isSelected && (
          <span
            className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
            style={{ background: config.color }}
          >
            ON
          </span>
        )}
      </div>

      {/* Total */}
      <p className="text-2xl font-extrabold text-[#1A1A2E] leading-none">
        {config.format(stats.total)}
      </p>

      {/* Sub-stats */}
      <div className="flex gap-3 text-[11px] text-[#9090B0]">
        <span>Avg&nbsp;{config.format(stats.avgPerHour)}/h</span>
        <span>Peak&nbsp;{formatHour(stats.bestHour.hour)}</span>
      </div>
    </button>
  );
}

// ─── AdsHourlySection ────────────────────────────────────────────────────────

export function AdsHourlySection({
  data = MOCK_HOURLY_DATA,
  onRangeSelected,
}: AdsHourlySectionProps) {
  const { cards, selectedForChart, toggleChartMetric } = useMetricCards();
  const { selectedRange, onDragStart, onDragMove, onDragEnd, clearSelection } =
    useHourlyChart(onRangeSelected);

  // Split selected metrics into volume (bar) and rate (line)
  const volumeMetrics = selectedForChart.filter(
    (k) => getConfigByKey(k).type === "volume",
  );
  const rateMetrics = selectedForChart.filter(
    (k) => getConfigByKey(k).type === "rate",
  );

  // Chart data: annotate drag range
  const chartData = data.map((d) => {
    const inRange =
      selectedRange &&
      d.hour >= selectedRange.startHour &&
      d.hour <= selectedRange.endHour;
    return { ...d, label: formatHour(d.hour), _inRange: inRange };
  });

  return (
    <section className="flex flex-col gap-6" aria-label="Ads Hourly Performance">
      {/* ── Metric Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => (
          <MetricCard
            key={card.metricKey}
            metricKey={card.metricKey}
            isSelected={card.isSelectedForChart}
            onToggle={() => toggleChartMetric(idx)}
            data={data}
          />
        ))}
      </div>

      {/* ── Hourly Chart ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#EAEAF4] bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1A1A2E]">
              Hourly Performance
            </h3>
            <p className="text-xs text-[#9090B0]">
              Click cards above to overlay metrics · Drag to select a range
            </p>
          </div>
          {selectedRange && (
            <button
              onClick={clearSelection}
              className="text-xs font-medium text-[#6B6BFF] hover:underline"
            >
              Clear selection ({formatHour(selectedRange.startHour)}–
              {formatHour(selectedRange.endHour)})
            </button>
          )}
        </div>

        {selectedForChart.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-48 text-[#B0B0C8] gap-2">
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 4-6" />
            </svg>
            <p className="text-sm">Select a metric card to show the chart</p>
          </div>
        ) : (
          <div
            role="img"
            aria-label="Hourly metrics chart"
            onMouseLeave={onDragEnd}
          >
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart
                data={chartData}
                onMouseDown={(e) => {
                  if (e?.activeLabel !== undefined) {
                    const hour = Number(
                      data.find((d) => formatHour(d.hour) === e.activeLabel)
                        ?.hour ?? -1,
                    );
                    if (hour >= 0) onDragStart(hour);
                  }
                }}
                onMouseMove={(e) => {
                  if (e?.activeLabel !== undefined) {
                    const hour = Number(
                      data.find((d) => formatHour(d.hour) === e.activeLabel)
                        ?.hour ?? -1,
                    );
                    if (hour >= 0) onDragMove(hour);
                  }
                }}
                onMouseUp={onDragEnd}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F8" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#9090B0" }}
                  tickLine={false}
                  axisLine={{ stroke: "#EAEAF4" }}
                />
                {/* Left axis — volume */}
                {volumeMetrics.length > 0 && (
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: "#9090B0" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                )}
                {/* Right axis — rate */}
                {rateMetrics.length > 0 && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: "#9090B0" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #EAEAF4",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />

                {/* Volume bars */}
                {volumeMetrics.map((key) => {
                  const cfg = getConfigByKey(key);
                  return (
                    <Bar
                      key={key}
                      yAxisId="left"
                      dataKey={key}
                      name={cfg.label}
                      fill={cfg.color}
                      opacity={0.85}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={20}
                    />
                  );
                })}

                {/* Rate lines */}
                {rateMetrics.map((key) => {
                  const cfg = getConfigByKey(key);
                  return (
                    <Line
                      key={key}
                      yAxisId="right"
                      type="monotone"
                      dataKey={key}
                      name={cfg.label}
                      stroke={cfg.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
