import { describe, expect, it } from "vitest";
import { formatStudyDuration } from "./format-study-duration";

describe("formatStudyDuration", () => {
  it("rounds repeating minute values", () => {
    expect(formatStudyDuration("1.03333333333 phút học")).toBe("1 phút học");
    expect(formatStudyDuration("1.45 phút học")).toBe("1.5 phút học");
  });

  it("leaves non-duration copy unchanged", () => {
    expect(formatStudyDuration("Tài nguyên bài học")).toBe("Tài nguyên bài học");
  });
});
