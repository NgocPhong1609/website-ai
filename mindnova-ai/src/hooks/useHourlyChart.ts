"use client";

import { useState, useCallback } from "react";
import type { DragRange } from "../types";
export interface UseHourlyChartReturn {
  dragStart: number | null;
  dragEnd: number | null;
  isDragging: boolean;
  selectedRange: DragRange | null;
  onDragStart: (hour: number) => void;
  onDragMove: (hour: number) => void;
  onDragEnd: () => void;
  clearSelection: () => void;
}

export function useHourlyChart(
  onRangeSelected?: (range: DragRange) => void,
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
    [isDragging],
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);

    if (dragStart === null || dragEnd === null) return;

    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);

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
