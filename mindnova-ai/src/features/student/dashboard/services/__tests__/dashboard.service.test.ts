import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { apiClient } from "@/src/shared/lib/api-client";
import { getDashboardOverview } from "../dashboard.service";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/src/shared/lib/api-client", () => ({ apiClient: vi.fn() }));

describe("getDashboardOverview", () => {
 beforeEach(() => {
 vi.clearAllMocks();
 });

 afterEach(() => {
 vi.restoreAllMocks();
 });

 it("skips the dashboard request when there is no access token", async () => {
 vi.mocked(cookies).mockResolvedValue({
 get: vi.fn().mockReturnValue(undefined),
 } as never);

 const result = await getDashboardOverview();

 expect(apiClient).not.toHaveBeenCalled();
 expect(result.user).toBeNull();
 expect(result.error).toBeUndefined();
 });

 it("does not warn when the access token is expired", async () => {
 vi.mocked(cookies).mockResolvedValue({
 get: vi.fn().mockReturnValue({ value: "expired-token" }),
 } as never);
 vi.mocked(apiClient).mockRejectedValue(
 new Error("[apiClient] Unauthorized (401). Token may have expired."),
 );
 const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

 const result = await getDashboardOverview();

 expect(result.error).toContain("Phiên đăng nhập đã hết hạn");
	expect(result.session_expired).toBe(true);
 expect(warning).not.toHaveBeenCalled();
 });
});