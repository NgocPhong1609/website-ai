// Public API for the ads-hourly feature
export { AdsHourlySection } from "./AdsHourlySection";

// Types
export type {
  MetricKey,
  MetricType,
  MetricConfig,
  HourlyDataPoint,
  CardStats,
  CardState,
  DragRange,
} from "./types";

// Constants (for consumers who need to build their own UI)
export {
  METRIC_CONFIGS,
  ALL_METRIC_KEYS,
  DEFAULT_CARD_METRICS,
  MAX_CHART_METRICS,
  MOCK_HOURLY_DATA,
} from "./constants";

// Hooks (for consumers who want to compose their own layout)
export { useMetricCards, computeCardStats } from "./hooks/useMetricCards";
export { useHourlyChart } from "./hooks/useHourlyChart";

// Sub-components (for consumers who want to customize the layout)
export {
  MetricCards,
  MetricCard,
  MetricDropdown,
} from "./components/MetricCards";
export {
  HourlyChart,
  ChartLegend,
  CustomTooltip,
} from "./components/HourlyChart";
