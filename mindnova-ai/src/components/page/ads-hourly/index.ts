// Public API for the ads-hourly feature
export { AdsHourlySection } from "./HourlyChart/AdsHourlySection";

// Types
export type {
  MetricKey,
  MetricType,
  MetricConfig,
  HourlyDataPoint,
  CardStats,
  CardState,
  DragRange,
} from "../../../types/admin";

// Constants (for consumers who need to build their own UI)
export {
  METRIC_CONFIGS,
  ALL_METRIC_KEYS,
  DEFAULT_CARD_METRICS,
  MAX_CHART_METRICS,
  MOCK_HOURLY_DATA,
} from "../../../constants/ads-hourly";
