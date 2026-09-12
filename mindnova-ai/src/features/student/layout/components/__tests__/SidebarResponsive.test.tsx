import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Sidebar from "../Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("student sidebar responsive layout", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("uses the compact sidebar on narrow screens and restores the full sidebar on desktop", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 390 });
    const { container } = render(<Sidebar />);
    const sidebar = container.querySelector("aside");

    await waitFor(() => expect(sidebar).toHaveClass("w-[72px]"));
    expect(screen.queryByText("AI-Powered Learning")).not.toBeInTheDocument();

    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    await waitFor(() => expect(sidebar).toHaveClass("w-60"));
    expect(screen.getByText("AI-Powered Learning")).toBeVisible();
  });
});
