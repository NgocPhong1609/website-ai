export type AiPeriod = "7d" | "30d";
export type AiPackage = { daily_requests: number; daily_tokens: number | null };
export type WritableAiConfig = {
  packages: { free: AiPackage; premium: AiPackage };
  prompts: { ai_tro_giang: string; ai_cham_bai: string };
};
export type AiProvider = { name: string; model: string | null; configured: boolean };
export type AiMetricProvenance = {
  available: boolean;
  source: "provider" | "estimated" | "mixed" | "unavailable";
  coverage: "complete" | "partial" | "unavailable";
  sourced_requests: number;
  recorded_requests: number;
};
export type AiUsage = {
  period: AiPeriod;
  available: boolean;
  from: string;
  to: string;
  coverage: "recorded_requests";
  requests: { total: number; successful: number; failed: number; status_unavailable: number };
  tokens: AiMetricProvenance & { input: number | null; output: number | null };
  cost: AiMetricProvenance & { amount: number | null; currency: string | null };
  daily_trend: Array<{ date: string; requests: number }>;
  provider_breakdown: Array<{ provider: string; model: string | null; requests: number }>;
};
export type AdminAiSystemData = WritableAiConfig & {
  providers: { primary: AiProvider; backup: AiProvider };
  usage: AiUsage;
  updated_at: string | null;
};
