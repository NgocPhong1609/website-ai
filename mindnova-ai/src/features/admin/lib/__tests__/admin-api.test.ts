import { afterEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "../admin-api";
import { getErrorMessage, getValidationErrors } from "@/src/shared/lib/user-error";

afterEach(() => vi.unstubAllGlobals());

describe("adminApi error messages", () => {
  it("preserves gateway status and hides HTML diagnostics", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>Application failed to respond</html>", { status: 502 })));
    const error = await adminApi("/api/admin/users").catch(error => error);
    expect(error).toMatchObject({ status: 502 });
    expect(getErrorMessage(error)).toContain("Vui lòng thử lại");
    expect(getErrorMessage(error)).not.toMatch(/<html>|Application failed/);
  });

  it("keeps field validation available and translates its message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      message: "The title field is required.", errors: { title: ["The title field is required."] },
    }), { status: 422 })));
    const error = await adminApi("/api/admin/courses").catch(error => error);
    expect(error).toMatchObject({ status: 422 });
    expect(getValidationErrors(error).title).toBe("Vui lòng nhập tiêu đề.");
  });

  it("shows a Vietnamese recovery message after a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const error = await adminApi("/api/admin/users").catch(error => error);
    expect(getErrorMessage(error)).toContain("kiểm tra kết nối mạng");
    expect(getErrorMessage(error)).not.toContain("Failed to fetch");
  });
});
