import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useDebounce from "@/src/hooks/useDebounce";

describe("useDebounce Hook Suite", () => {
  it("debounces value changes over time delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    });

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");

    vi.useRealTimers();
  });
});
