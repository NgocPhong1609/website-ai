"use client";

import type { HourlyDataPoint } from "../../types";
import type { UseMetricCardsReturn } from "../../hooks/useMetricCards";
import { MetricCard } from "./MetricCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCardsProps extends Pick<
  UseMetricCardsReturn,
  "cards" | "swapMetric" | "toggleChartMetric"
> {
  data: HourlyDataPoint[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MetricCards({
  cards,
  data,
  swapMetric,
  toggleChartMetric,
}: MetricCardsProps) {
  // All metrics currently shown across all card slots (used for "in use" label in dropdown)
  const allCardMetrics = cards.map((c) => c.metricKey);

  return (
    <div
      role="group"
      aria-label="Performance metric cards"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
    >
      {cards.map((card, index) => {
        // "usedMetrics" for a card = all metrics on OTHER cards
        const usedMetrics = allCardMetrics.filter((_, i) => i !== index);

        return (
          <MetricCard
            key={`card-${index}`}
            card={card}
            cardIndex={index}
            usedMetrics={usedMetrics}
            data={data}
            onSwap={swapMetric}
            onToggleChart={toggleChartMetric}
          />
        );
      })}
    </div>
  );
}
