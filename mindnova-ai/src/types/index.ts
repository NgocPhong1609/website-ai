// ─── Shared Types — src/types/index.ts ───────────────────────────────────────
// Re-export types used by shared hooks (useHourlyChart, useMetricCards)

export type MetricKey =
  | "clicks"
  | "impressions"
  | "cost"
  | "orders"
  | "sales"
  | "roas"
  | "acos"
  | "cvr"
  | "cpc"
  | "ctr";

export type MetricType = "volume" | "rate";

export interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  type: MetricType;
  format: (value: number) => string;
}

export interface HourlyDataPoint {
  hour: number;
  clicks: number;
  impressions: number;
  cost: number;
  orders: number;
  sales: number;
  roas: number;
  acos: number;
  cvr: number;
  cpc: number;
  ctr: number;
}

export interface HourStat {
  hour: number;
  value: number;
}

export interface CardStats {
  total: number;
  avgPerHour: number;
  bestHour: HourStat;
  worstHour: HourStat;
}

export interface CardState {
  metricKey: MetricKey;
  isSelectedForChart: boolean;
}

export interface DragRange {
  startHour: number;
  endHour: number;
}
