/**
 * useChartResponsive
 * ─────────────────────────────────────────────────────────────────────────────
 * Container-aware responsive hook cho Recharts.
 *
 * Sử dụng ResizeObserver (không phải window resize) để đo kích thước container
 * thực tế, đảm bảo chart phản ứng đúng kể cả trong sidebar / panel / modal.
 *
 * Performance:
 *  - Debounce 80ms để tránh re-render liên tục khi resize
 *  - Tự cleanup observer khi unmount
 *  - Tất cả derived values được memo-ize thông qua useMemo
 *
 * @example
 * ```tsx
 * const { ref, width, breakpoint, chartProps } = useChartResponsive();
 * return (
 *   <div ref={ref}>
 *     <BarChart width={width} height={300} {...chartProps} data={data}>
 *       ...
 *     </BarChart>
 *   </div>
 * );
 * ```
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface ChartDimensions {
  width: number;
  height: number;
}

export interface ChartResponsiveState {
  /** Kích thước thực của container (px) */
  dimensions: ChartDimensions;
  /** Width tắt gọn cho tiện truy cập */
  width: number;
  /** Breakpoint dựa trên container width (không phải viewport) */
  breakpoint: ChartBreakpoint;
  /** true khi container nhỏ hơn md (480px) */
  isCompact: boolean;
  /** Props an toàn truyền thẳng vào chart component */
  chartProps: { margin: { top: number; right: number; bottom: number; left: number } };
  /** Ref gắn vào div wrapper của chart */
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseChartResponsiveOptions {
  /** Debounce delay tính bằng ms (default: 80) */
  debounceMs?: number;
  /** Kích thước ban đầu khi chưa đo được container */
  initialWidth?: number;
  /** Custom breakpoints theo container width (px) */
  breakpoints?: {
    sm?: number; // default 320
    md?: number; // default 480
    lg?: number; // default 640
    xl?: number; // default 960
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveBreakpoint(
  width: number,
  bp: Required<NonNullable<UseChartResponsiveOptions["breakpoints"]>>
): ChartBreakpoint {
  if (width >= bp.xl) return "xl";
  if (width >= bp.lg) return "lg";
  if (width >= bp.md) return "md";
  if (width >= bp.sm) return "sm";
  return "xs";
}

function resolveMargin(breakpoint: ChartBreakpoint) {
  switch (breakpoint) {
    case "xs": return { top: 4,  right: 4,  bottom: 4,  left: -16 };
    case "sm": return { top: 8,  right: 8,  bottom: 8,  left: -8  };
    case "md": return { top: 10, right: 16, bottom: 10, left: 0   };
    default:   return { top: 12, right: 24, bottom: 12, left: 8   };
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChartResponsive(
  options: UseChartResponsiveOptions = {}
): ChartResponsiveState {
  const {
    debounceMs   = 80,
    initialWidth = 0,
    breakpoints  = {},
  } = options;

  const resolvedBp = useMemo(
    () => ({
      sm: breakpoints.sm ?? 320,
      md: breakpoints.md ?? 480,
      lg: breakpoints.lg ?? 640,
      xl: breakpoints.xl ?? 960,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl]
  );

  const ref             = useRef<HTMLDivElement>(null!);
  const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width:  initialWidth,
    height: 0,
  });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setDimensions({ width: el.clientWidth, height: el.clientHeight });
  }, []);

  const debouncedMeasure = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(measure, debounceMs);
  }, [measure, debounceMs]);

  useEffect(() => {
    measure(); // Đo ngay lần đầu

    const observer = new ResizeObserver(debouncedMeasure);
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [measure, debouncedMeasure]);

  const breakpoint = useMemo(
    () => resolveBreakpoint(dimensions.width, resolvedBp),
    [dimensions.width, resolvedBp]
  );

  const isCompact = breakpoint === "xs" || breakpoint === "sm";

  const chartProps = useMemo(
    () => ({ margin: resolveMargin(breakpoint) }),
    [breakpoint]
  );

  return {
    dimensions,
    width: dimensions.width,
    breakpoint,
    isCompact,
    chartProps,
    ref,
  };
}
