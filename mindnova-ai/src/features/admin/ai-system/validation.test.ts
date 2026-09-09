import { describe, expect, it } from "vitest";
import { validateAiConfig } from "./validation";

const candidate = () => ({
  packages: {
    free: { daily_requests: 30, daily_tokens: null as number | null },
    premium: { daily_requests: 200, daily_tokens: null as number | null },
  },
  prompts: { ai_tro_giang: "Hướng dẫn học sinh", ai_cham_bai: "Chấm bài công bằng" },
});

describe("validateAiConfig", () => {
  it("accepts valid limits and nullable token limits", () => {
    expect(validateAiConfig(candidate())).toEqual({});
  });

  it("rejects a premium request limit below the free limit", () => {
    const data = candidate();
    data.packages.premium.daily_requests = 20;
    expect(validateAiConfig(data).packages?.premium?.daily_requests).toBeDefined();
  });

  it.each(["", "   ", "x".repeat(4001)])("rejects invalid prompt length", (prompt) => {
    const data = candidate();
    data.prompts.ai_tro_giang = prompt;
    data.prompts.ai_cham_bai = prompt;
    expect(validateAiConfig(data).prompts).toEqual({
      ai_tro_giang: expect.any(String), ai_cham_bai: expect.any(String),
    });
  });

  it("accepts 4000 Unicode characters", () => {
    const data = candidate();
    data.prompts.ai_tro_giang = "😀".repeat(4000);
    expect(validateAiConfig(data)).toEqual({});
  });

  it.each([0, -1, 1.5, NaN, Infinity, 2001])("rejects invalid free request limit %s", (limit) => {
    const data = candidate();
    data.packages.free.daily_requests = limit;
    expect(validateAiConfig(data).packages?.free?.daily_requests).toBeDefined();
  });

  it.each([0, 1.5, NaN, 10001])("rejects invalid premium request limit %s", (limit) => {
    const data = candidate();
    data.packages.premium.daily_requests = limit;
    expect(validateAiConfig(data).packages?.premium?.daily_requests).toBeDefined();
  });

  it.each([0, -1, 1.5, NaN, Infinity])("rejects invalid token limit %s", (limit) => {
    const data = candidate();
    data.packages.free.daily_tokens = limit;
    data.packages.premium.daily_tokens = limit;
    expect(validateAiConfig(data).packages?.free?.daily_tokens).toBeDefined();
    expect(validateAiConfig(data).packages?.premium?.daily_tokens).toBeDefined();
  });

  it("accepts positive token limits and request boundaries", () => {
    const data = candidate();
    data.packages.free = { daily_requests: 2000, daily_tokens: 1 };
    data.packages.premium = { daily_requests: 10000, daily_tokens: 50000 };
    expect(validateAiConfig(data)).toEqual({});
  });
});
