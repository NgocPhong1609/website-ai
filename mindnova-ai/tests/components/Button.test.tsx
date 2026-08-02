import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "@/src/components/ui/Button";

describe("Button UI Component Suite", () => {
  it("renders button text properly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles onClick callback when interacted with", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    
    fireEvent.click(screen.getByText("Submit"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies primary design styles by default", () => {
    const { container } = render(<Button>Primary</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("bg-");
  });
});
