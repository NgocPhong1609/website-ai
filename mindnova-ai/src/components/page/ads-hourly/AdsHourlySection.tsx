"use client";

import type { DragRange } from "./types";
import { MOCK_HOURLY_DATA } from "./constants";
import { useMetricCards } from "./hooks/useMetricCards";
import { MetricCards } from "./components/MetricCards";
import { HourlyChart } from "./components/HourlyChart";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdsHourlySectionProps {
  /**
   * Called when user completes a drag-select on the chart.
   * In production: show a modal, navigate to bid schedule, etc.
   */
  onRangeSelected?: (range: DragRange) => void;
  /**
   * Hourly performance data.
   * Falls back to MOCK_HOURLY_DATA when not provided.
   */
  data?: typeof MOCK_HOURLY_DATA;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AdsHourlySection
 *
 * Composes MetricCards (1.1) and HourlyChart (1.2) together.
 * This is the only component consumers need to import.
 *
 * @example
 * ```tsx
 * <AdsHourlySection onRangeSelected={(range) => openBidScheduleModal(range)} />
 * ```
 */
export function AdsHourlySection({
  onRangeSelected,
  data = MOCK_HOURLY_DATA,
}: AdsHourlySectionProps) {
  const { cards, selectedForChart, swapMetric, toggleChartMetric } =
    useMetricCards();

  return (
    <section
      aria-label="Hourly performance overview"
      className="flex flex-col gap-4"
    >
      {/* 1.1 – Metric Cards */}
      <MetricCards
        cards={cards}
        data={data}
        swapMetric={swapMetric}
        toggleChartMetric={toggleChartMetric}
      />

      {/* 1.2 – Hourly Chart */}
      <HourlyChart
        selectedMetrics={selectedForChart}
        data={data}
        onRangeSelected={onRangeSelected}
      />
    </section>
  );
}
