// ─── Metric Keys ─────────────────────────────────────────────────────────────

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

/** volume → rendered as Bar on left axis; rate → rendered as Line on right axis */
export type MetricType = "volume" | "rate";

// ─── Metric Config ────────────────────────────────────────────────────────────

export interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  type: MetricType;
  format: (value: number) => string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

/** One entry per hour (0–23). Index keys match MetricKey values. */
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

// ─── Card Stats ───────────────────────────────────────────────────────────────

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

// ─── Card State ───────────────────────────────────────────────────────────────

/** State for one metric card slot (index 0-4) */
export interface CardState {
  metricKey: MetricKey;
  isSelectedForChart: boolean;
}

// ─── Drag Select ─────────────────────────────────────────────────────────────

export interface DragRange {
  startHour: number;
  endHour: number;
}
