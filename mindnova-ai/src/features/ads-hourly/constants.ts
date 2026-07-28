import type { MetricConfig, MetricKey, HourlyDataPoint } from "./types";

// ─── Number Formatter ─────────────────────────────────────────────────────────

function fmt(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

// ─── Metric Configs ───────────────────────────────────────────────────────────

export const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  sales: {
    key: "sales",
    label: "Sales",
    color: "#06B6D4",
    type: "volume",
    format: (v) => `¥${fmt(v)}`,
  },
  cost: {
    key: "cost",
    label: "Cost",
    color: "#F97316",
    type: "volume",
    format: (v) => `¥${fmt(v)}`,
  },
  roas: {
    key: "roas",
    label: "ROAS",
    color: "#6366F1",
    type: "rate",
    format: (v) => `${v.toFixed(1)}%`,
  },
  clicks: {
    key: "clicks",
    label: "Clicks",
    color: "#3B82F6",
    type: "volume",
    format: (v) => fmt(v),
  },
  orders: {
    key: "orders",
    label: "Orders",
    color: "#22C55E",
    type: "volume",
    format: (v) => fmt(v),
  },
  impressions: {
    key: "impressions",
    label: "Impressions",
    color: "#A855F7",
    type: "volume",
    format: (v) => fmt(v),
  },
  acos: {
    key: "acos",
    label: "ACOS",
    color: "#EF4444",
    type: "rate",
    format: (v) => `${v.toFixed(1)}%`,
  },
  cvr: {
    key: "cvr",
    label: "CVR",
    color: "#10B981",
    type: "rate",
    format: (v) => `${v.toFixed(2)}%`,
  },
  cpc: {
    key: "cpc",
    label: "CPC",
    color: "#F59E0B",
    type: "rate",
    format: (v) => `¥${v.toFixed(2)}`,
  },
  ctr: {
    key: "ctr",
    label: "CTR",
    color: "#8B5CF6",
    type: "rate",
    format: (v) => `${v.toFixed(2)}%`,
  },
};

/** All 10 metric keys in display order */
export const ALL_METRIC_KEYS: MetricKey[] = [
  "clicks",
  "impressions",
  "cost",
  "orders",
  "sales",
  "roas",
  "acos",
  "cvr",
  "cpc",
  "ctr",
];

/** Default metrics displayed on each of the 5 cards */
export const DEFAULT_CARD_METRICS: MetricKey[] = [
  "sales",
  "cost",
  "roas",
  "clicks",
  "orders",
];

/** Maximum metrics that can be toggled onto the chart simultaneously */
export const MAX_CHART_METRICS = 3;

// ─── Mock Hourly Data ─────────────────────────────────────────────────────────

/**
 * Realistic mock data for 24 hours.
 * Replace with real API data in production.
 */
export const MOCK_HOURLY_DATA: HourlyDataPoint[] = [
  { hour: 0,  sales: 42,   cost: 8,   clicks: 12,  impressions: 420,  orders: 0,  roas: 525.0, acos: 19.0, cvr: 0.00, cpc: 0.67, ctr: 2.86 },
  { hour: 1,  sales: 38,   cost: 7,   clicks: 10,  impressions: 380,  orders: 0,  roas: 542.9, acos: 18.4, cvr: 0.00, cpc: 0.70, ctr: 2.63 },
  { hour: 2,  sales: 35,   cost: 6,   clicks: 9,   impressions: 310,  orders: 0,  roas: 583.3, acos: 17.1, cvr: 0.00, cpc: 0.67, ctr: 2.90 },
  { hour: 3,  sales: 30,   cost: 5,   clicks: 8,   impressions: 280,  orders: 0,  roas: 600.0, acos: 16.7, cvr: 0.00, cpc: 0.63, ctr: 2.86 },
  { hour: 4,  sales: 25,   cost: 4,   clicks: 7,   impressions: 250,  orders: 0,  roas: 625.0, acos: 16.0, cvr: 0.00, cpc: 0.57, ctr: 2.80 },
  { hour: 5,  sales: 28,   cost: 5,   clicks: 8,   impressions: 270,  orders: 0,  roas: 560.0, acos: 17.9, cvr: 0.00, cpc: 0.63, ctr: 2.96 },
  { hour: 6,  sales: 210,  cost: 38,  clicks: 52,  impressions: 1050, orders: 2,  roas: 552.6, acos: 18.1, cvr: 3.85, cpc: 0.73, ctr: 4.95 },
  { hour: 7,  sales: 620,  cost: 110, clicks: 145, impressions: 2900, orders: 5,  roas: 563.6, acos: 17.7, cvr: 3.45, cpc: 0.76, ctr: 5.00 },
  { hour: 8,  sales: 980,  cost: 175, clicks: 230, impressions: 4600, orders: 9,  roas: 560.0, acos: 17.9, cvr: 3.91, cpc: 0.76, ctr: 5.00 },
  { hour: 9,  sales: 1480, cost: 255, clicks: 340, impressions: 6800, orders: 14, roas: 580.4, acos: 17.2, cvr: 4.12, cpc: 0.75, ctr: 5.00 },
  { hour: 10, sales: 1920, cost: 335, clicks: 445, impressions: 8900, orders: 18, roas: 573.1, acos: 17.4, cvr: 4.04, cpc: 0.75, ctr: 5.00 },
  { hour: 11, sales: 2120, cost: 370, clicks: 490, impressions: 9800, orders: 20, roas: 572.9, acos: 17.5, cvr: 4.08, cpc: 0.76, ctr: 5.00 },
  { hour: 12, sales: 2080, cost: 362, clicks: 480, impressions: 9600, orders: 19, roas: 574.6, acos: 17.4, cvr: 3.96, cpc: 0.75, ctr: 5.00 },
  { hour: 13, sales: 2200, cost: 385, clicks: 510, impressions: 10200, orders: 21, roas: 571.4, acos: 17.5, cvr: 4.12, cpc: 0.76, ctr: 5.00 },
  { hour: 14, sales: 2350, cost: 410, clicks: 545, impressions: 10900, orders: 22, roas: 573.2, acos: 17.4, cvr: 4.04, cpc: 0.75, ctr: 5.00 },
  { hour: 15, sales: 2580, cost: 450, clicks: 598, impressions: 11960, orders: 24, roas: 573.3, acos: 17.4, cvr: 4.01, cpc: 0.75, ctr: 5.00 },
  { hour: 16, sales: 2720, cost: 475, clicks: 630, impressions: 12600, orders: 26, roas: 572.6, acos: 17.5, cvr: 4.13, cpc: 0.75, ctr: 5.00 },
  { hour: 17, sales: 3100, cost: 540, clicks: 718, impressions: 14360, orders: 29, roas: 574.1, acos: 17.4, cvr: 4.04, cpc: 0.75, ctr: 5.00 },
  { hour: 18, sales: 3340, cost: 582, clicks: 775, impressions: 15500, orders: 32, roas: 573.9, acos: 17.4, cvr: 4.13, cpc: 0.75, ctr: 5.00 },
  { hour: 19, sales: 3820, cost: 665, clicks: 885, impressions: 17700, orders: 37, roas: 574.4, acos: 17.4, cvr: 4.18, cpc: 0.75, ctr: 5.00 },
  { hour: 20, sales: 3650, cost: 635, clicks: 846, impressions: 16920, orders: 35, roas: 574.8, acos: 17.4, cvr: 4.14, cpc: 0.75, ctr: 5.00 },
  { hour: 21, sales: 3280, cost: 572, clicks: 761, impressions: 15220, orders: 31, roas: 573.1, acos: 17.5, cvr: 4.07, cpc: 0.75, ctr: 5.00 },
  { hour: 22, sales: 2180, cost: 380, clicks: 506, impressions: 10120, orders: 20, roas: 573.7, acos: 17.4, cvr: 3.95, cpc: 0.75, ctr: 5.00 },
  { hour: 23, sales: 980,  cost: 172, clicks: 228, impressions: 4560,  orders: 9,  roas: 569.8, acos: 17.5, cvr: 3.95, cpc: 0.75, ctr: 5.00 },
];
