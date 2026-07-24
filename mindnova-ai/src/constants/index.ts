// ─── Shared Constants — src/constants/index.ts ───────────────────────────────
// Shared constants used by useMetricCards hook

import type { MetricKey } from "../types";

/** Default 5 metric keys displayed on the metric cards panel */
export const DEFAULT_CARD_METRICS: MetricKey[] = [
  "clicks",
  "impressions",
  "cost",
  "orders",
  "sales",
];

/** Maximum number of metrics that can be selected for the chart simultaneously */
export const MAX_CHART_METRICS = 3;
