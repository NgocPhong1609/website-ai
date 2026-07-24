"use client";

import { useState, useCallback } from "react";
import type { DragRange } from "../types";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseHourlyChartReturn {
  /** Hour where drag started (null when not dragging) */
  dragStart: number | null;
  /** Hour where drag cursor is currently (null when not dragging) */
  dragEnd: number | null;
  /** Whether a drag is currently in progress */
  isDragging: boolean;
  /** Completed drag range; null until first drag completes */
  selectedRange: DragRange | null;
  /** Call when mouse-down fires on the chart with the hovered hour */
  onDragStart: (hour: number) => void;
  /** Call when mouse-move fires on the chart with the hovered hour */
  onDragMove: (hour: number) => void;
  /**
   * Call when mouse-up fires. Fires `onRangeSelected` if the range is valid
   * (startHour !== endHour), otherwise clears state.
   */
  onDragEnd: () => void;
  /** Clears the current selection */
  clearSelection: () => void;
}

export function useHourlyChart(
  onRangeSelected?: (range: DragRange) => void
): UseHourlyChartReturn {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DragRange | null>(null);

  const onDragStart = useCallback((hour: number) => {
    setDragStart(hour);
    setDragEnd(hour);
    setIsDragging(true);
    setSelectedRange(null);
  }, []);

  const onDragMove = useCallback(
    (hour: number) => {
      if (!isDragging) return;
      setDragEnd(hour);
    },
    [isDragging]
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);

    if (dragStart === null || dragEnd === null) return;

    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);

    // Require at least a 1-hour range to be considered intentional
    if (start === end) {
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    const range: DragRange = { startHour: start, endHour: end };
    setSelectedRange(range);
    setDragStart(null);
    setDragEnd(null);
    onRangeSelected?.(range);
  }, [dragStart, dragEnd, onRangeSelected]);

  const clearSelection = useCallback(() => {
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
    setSelectedRange(null);
  }, []);

  return {
    dragStart,
    dragEnd,
    isDragging,
    selectedRange,
    onDragStart,
    onDragMove,
    onDragEnd,
    clearSelection,
  };
}
