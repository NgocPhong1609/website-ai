import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DashboardStatsPanel } from "../DashboardStatsPanel";

vi.mock("../StudyStreakInteractive", () => ({ StudyStreakInteractive: () => null }));

afterEach(cleanup);

it("links focus-area actions to the practice page with the topic prefilled", () => {
  render(
    <DashboardStatsPanel
      focusAreas={[
        { id: 1, topic: "Cấu trúc dữ liệu Tree", accuracy: 30, action: "review" },
        { id: 2, topic: "React Custom Hooks", accuracy: 60, action: "practice" },
      ]}
    />,
  );

  expect(screen.getByRole("link", { name: "Ôn tập" })).toHaveAttribute(
    "href",
    `/practice?topic=${encodeURIComponent("Cấu trúc dữ liệu Tree")}`,
  );
  expect(screen.getByRole("link", { name: "Luyện quiz" })).toHaveAttribute(
    "href",
    "/practice?topic=React%20Custom%20Hooks",
  );
});
