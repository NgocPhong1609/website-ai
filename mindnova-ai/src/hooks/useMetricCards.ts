"use client";

import { useState, useCallback } from "react";
import type { MetricKey, CardState, CardStats, HourlyDataPoint } from "../types";
import {
  DEFAULT_CARD_METRICS,
  MAX_CHART_METRICS,
} from "../constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes Total, Avg/hour, Best hour, Worst hour for a given metric.
 * Only hours with value > 0 are considered for best/worst to avoid
 * skewing toward inactive midnight hours.
 */
export function computeCardStats(
  metricKey: MetricKey,
  data: HourlyDataPoint[]
): CardStats {
  const values = data.map((d) => ({ hour: d.hour, value: d[metricKey] }));

  const total = values.reduce((sum, d) => sum + d.value, 0);
  const avgPerHour = total / 24;

  // Prefer non-zero hours for best/worst; fall back to full array
  const nonZero = values.filter((d) => d.value > 0);
  const pool = nonZero.length > 0 ? nonZero : values;

  const bestHour = pool.reduce((best, d) => (d.value > best.value ? d : best));
  const worstHour = pool.reduce((worst, d) =>
    d.value < worst.value ? d : worst
  );

  return { total, avgPerHour, bestHour, worstHour };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseMetricCardsReturn {
  /** State for each of the 5 card slots */
  cards: CardState[];
  /** Ordered list of metrics currently selected for the chart (max 3) */
  selectedForChart: MetricKey[];
  /**
   * Swap the metric displayed on a specific card.
   * If the card was selected for chart, the chart selection follows the new metric.
   */
  swapMetric: (cardIndex: number, newMetric: MetricKey) => void;
  /**
   * Toggle a metric on/off the chart from a card click.
   * When the chart already has MAX_CHART_METRICS, the oldest selected metric
   * is evicted (FIFO) to make room.
   */
  toggleChartMetric: (cardIndex: number) => void;
}

export function useMetricCards(): UseMetricCardsReturn {
  const [cards, setCards] = useState<CardState[]>(() =>
    DEFAULT_CARD_METRICS.map((key) => ({
      metricKey: key,
      isSelectedForChart: false,
    }))
  );

  // Ordered selection queue for FIFO eviction when max is reached
  const [selectionQueue, setSelectionQueue] = useState<MetricKey[]>([]);

  const selectedForChart = selectionQueue;

  const swapMetric = useCallback(
    (cardIndex: number, newMetric: MetricKey) => {
      setCards((prev) => {
        const next = [...prev];
        const card = next[cardIndex];
        const oldMetric = card.metricKey;

        // If the old metric was on chart, replace it with the new one
        if (card.isSelectedForChart) {
          setSelectionQueue((q) =>
            q.map((k) => (k === oldMetric ? newMetric : k))
          );
        }

        next[cardIndex] = { ...card, metricKey: newMetric };
        return next;
      });
    },
    []
  );

  const toggleChartMetric = useCallback((cardIndex: number) => {
    setCards((prev) => {
      const next = [...prev];
      const card = next[cardIndex];
      const metric = card.metricKey;

      if (card.isSelectedForChart) {
        // Deselect
        next[cardIndex] = { ...card, isSelectedForChart: false };
        setSelectionQueue((q) => q.filter((k) => k !== metric));
      } else {
        // Select — evict oldest if at max capacity
        next[cardIndex] = { ...card, isSelectedForChart: true };
        setSelectionQueue((q) => {
          const updated = [...q, metric];
          if (updated.length > MAX_CHART_METRICS) {
            const evicted = updated.shift()!;
            // Mark evicted card as deselected
            const evictedIdx = next.findIndex((c) => c.metricKey === evicted);
            if (evictedIdx !== -1) {
              next[evictedIdx] = {
                ...next[evictedIdx],
                isSelectedForChart: false,
              };
            }
          }
          return updated;
        });
      }

      return next;
    });
  }, []);

  return { cards, selectedForChart, swapMetric, toggleChartMetric };
}
