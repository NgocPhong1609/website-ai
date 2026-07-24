// ─── Ads-Hourly Constants — src/constants/ads-hourly/index.ts ────────────────

import type { MetricKey, MetricConfig, HourlyDataPoint } from "../../types";

// ─── Metric Config ────────────────────────────────────────────────────────────

export const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: "clicks",
    label: "Clicks",
    color: "#6B6BFF",
    type: "volume",
    format: (v) => v.toLocaleString(),
  },
  {
    key: "impressions",
    label: "Impressions",
    color: "#22C55E",
    type: "volume",
    format: (v) => v.toLocaleString(),
  },
  {
    key: "cost",
    label: "Cost",
    color: "#F59E0B",
    type: "volume",
    format: (v) => `$${v.toFixed(2)}`,
  },
  {
    key: "orders",
    label: "Orders",
    color: "#EC4899",
    type: "volume",
    format: (v) => v.toLocaleString(),
  },
  {
    key: "sales",
    label: "Sales",
    color: "#14B8A6",
    type: "volume",
    format: (v) => `$${v.toLocaleString()}`,
  },
  {
    key: "roas",
    label: "ROAS",
    color: "#8B5CF6",
    type: "rate",
    format: (v) => v.toFixed(2),
  },
  {
    key: "acos",
    label: "ACoS",
    color: "#EF4444",
    type: "rate",
    format: (v) => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: "cvr",
    label: "CVR",
    color: "#06B6D4",
    type: "rate",
    format: (v) => `${(v * 100).toFixed(2)}%`,
  },
  {
    key: "cpc",
    label: "CPC",
    color: "#F97316",
    type: "rate",
    format: (v) => `$${v.toFixed(2)}`,
  },
  {
    key: "ctr",
    label: "CTR",
    color: "#84CC16",
    type: "rate",
    format: (v) => `${(v * 100).toFixed(2)}%`,
  },
];

export const ALL_METRIC_KEYS: MetricKey[] = METRIC_CONFIGS.map((c) => c.key);

/** Default 5 metrics shown in card slots */
export const DEFAULT_CARD_METRICS: MetricKey[] = [
  "clicks",
  "impressions",
  "cost",
  "orders",
  "sales",
];

/** Max metrics selectable for the dual-axis chart */
export const MAX_CHART_METRICS = 3;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_HOURLY_DATA: HourlyDataPoint[] = Array.from(
  { length: 24 },
  (_, hour) => {
    const peak = hour >= 9 && hour <= 21 ? 1 : 0.2;
    const rand = () => Math.random() * peak;
    const clicks = Math.round(rand() * 500);
    const impressions = Math.round(clicks / (0.02 + Math.random() * 0.03));
    const cost = parseFloat((rand() * 50).toFixed(2));
    const orders = Math.round(rand() * 20);
    const sales = parseFloat((orders * (30 + Math.random() * 70)).toFixed(2));
    return {
      hour,
      clicks,
      impressions,
      cost,
      orders,
      sales,
      roas: cost > 0 ? parseFloat((sales / cost).toFixed(2)) : 0,
      acos: sales > 0 ? parseFloat((cost / sales).toFixed(4)) : 0,
      cvr: clicks > 0 ? parseFloat((orders / clicks).toFixed(4)) : 0,
      cpc: clicks > 0 ? parseFloat((cost / clicks).toFixed(4)) : 0,
      ctr:
        impressions > 0
          ? parseFloat((clicks / impressions).toFixed(4))
          : 0,
    };
  },
);
