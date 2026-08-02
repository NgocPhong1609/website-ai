import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ActorSwitcher } from "@/src/components/ui/ActorSwitcher";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("ActorSwitcher Navigation Component Suite", () => {
  it("renders current actor mode as Student on default route", () => {
    render(<ActorSwitcher />);
    expect(screen.getByText("Học viên (Student)")).toBeInTheDocument();
  });

  it("opens dropdown and shows Instructor option", () => {
    render(<ActorSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText(/Giảng viên/i)).toBeInTheDocument();
  });
});
