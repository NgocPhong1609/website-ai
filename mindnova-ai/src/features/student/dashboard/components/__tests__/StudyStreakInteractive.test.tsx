import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StudyStreakInteractive } from "../StudyStreakInteractive";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

afterEach(() => {
  cleanup();
});

it("lights weekly bars only for days that were actually checked in", () => {
  const { container } = render(
    <StudyStreakInteractive
      data={{ days: 2, message: "Giữ chuỗi" }}
      todayKey="T4"
      checkedInDates={["2099-01-04", "2099-01-05"]}
      weeklyActivity={{ T2: true, T3: true, T4: true, T5: true, T6: false, T7: false, CN: false }}
    />,
  );

  const bars = container.querySelectorAll("[data-checked]");
  expect(bars).toHaveLength(7);
  expect([...bars].filter((bar) => bar.getAttribute("data-checked") === "true")).toHaveLength(0);
});

it("lights today when the student already checked in", () => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
  const { container } = render(
    <StudyStreakInteractive
      data={{ days: 1, message: "", is_checked_in_today: true }}
      todayKey="T2"
      checkedInDates={[today]}
    />,
  );

  const lit = [...container.querySelectorAll("[data-checked]")].filter(
    (bar) => bar.getAttribute("data-checked") === "true",
  );
  expect(lit.length).toBeGreaterThan(0);
});
