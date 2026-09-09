import type { AiPackage, WritableAiConfig } from "./types";

export type AiConfigErrors = {
  packages?: Partial<Record<keyof WritableAiConfig["packages"], Partial<Record<keyof AiPackage, string>>>>;
  prompts?: Partial<Record<keyof WritableAiConfig["prompts"], string>>;
};

export function validateAiConfig(config: WritableAiConfig): AiConfigErrors {
  const errors: AiConfigErrors = {};
  for (const tier of ["free", "premium"] as const) {
    const value = config.packages[tier];
    const fields: Partial<Record<keyof AiPackage, string>> = {};
    const max = tier === "free" ? 2000 : 10000;
    if (!Number.isSafeInteger(value.daily_requests) || value.daily_requests < 1 || value.daily_requests > max) {
      fields.daily_requests = `Nhập số nguyên từ 1 đến ${max}.`;
    } else if (tier === "premium" && value.daily_requests < config.packages.free.daily_requests) {
      fields.daily_requests = "Hạn mức Premium phải bằng hoặc lớn hơn Free.";
    }
    if (value.daily_tokens !== null && (!Number.isSafeInteger(value.daily_tokens) || value.daily_tokens < 1)) {
      fields.daily_tokens = "Nhập số nguyên dương hoặc để trống.";
    }
    if (Object.keys(fields).length) (errors.packages ??= {})[tier] = fields;
  }
  for (const name of ["ai_tro_giang", "ai_cham_bai"] as const) {
    if (!config.prompts[name].trim() || Array.from(config.prompts[name]).length > 4000) {
      (errors.prompts ??= {})[name] = "Nội dung bắt buộc, tối đa 4000 ký tự.";
    }
  }
  return errors;
}
