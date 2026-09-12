import type { WritableAiConfig } from "./types";

// Match the canonical server defaults for responses containing legacy nullable values.
export function normalizeAiPrompts(prompts: WritableAiConfig["prompts"]): WritableAiConfig["prompts"] {
  return {
    ai_tro_giang: typeof prompts.ai_tro_giang === "string"
      ? prompts.ai_tro_giang
      : "Ban la AI tro giang, tra loi ngan gon, de hieu, uu tien tieng Viet.",
    ai_cham_bai: typeof prompts.ai_cham_bai === "string"
      ? prompts.ai_cham_bai
      : "Ban la AI cham bai, phan tich theo tieu chi ro rang va cong bang.",
  };
}
