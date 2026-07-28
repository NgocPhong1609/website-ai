"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoHeartbeatOptions {
  lessonId: number;
  totalDurationSeconds: number;
  initialWatchedSeconds?: number;
  intervalMs?: number;
  completionThreshold?: number;
  onComplete?: (lessonId: number) => void;
}

interface UseVideoHeartbeatReturn {
  watchedSeconds: number;
  watchPercent: number;
  isCompleted: boolean;
  handleTimeUpdate: (currentTime: number) => void;
  handlePlay: () => void;
  handlePause: () => void;
}

export function useVideoHeartbeat({
  lessonId,
  totalDurationSeconds,
  initialWatchedSeconds = 0,
  intervalMs = 15_000,
  completionThreshold = 0.9,
  onComplete,
}: UseVideoHeartbeatOptions): UseVideoHeartbeatReturn {
  const [watchedSeconds, setWatchedSeconds] = useState(initialWatchedSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    initialWatchedSeconds / totalDurationSeconds >= completionThreshold,
  );

  const lastPositionRef = useRef<number>(initialWatchedSeconds);
  const accumulatedRef = useRef<number>(initialWatchedSeconds);
  const hasCompletedRef = useRef(isCompleted);

  // ─── Heartbeat Effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const currentWatched = accumulatedRef.current;
      console.info(
        `[Heartbeat] lessonId=${lessonId} watchedSeconds=${currentWatched} timestamp=${Date.now()}`,
      );

      setWatchedSeconds(currentWatched);

      // Check completion threshold
      if (
        !hasCompletedRef.current &&
        totalDurationSeconds > 0 &&
        currentWatched / totalDurationSeconds >= completionThreshold
      ) {
        hasCompletedRef.current = true;
        setIsCompleted(true);
        onComplete?.(lessonId);
        console.info(
          `[Heartbeat] Lesson ${lessonId} marked COMPLETED (${currentWatched}/${totalDurationSeconds}s)`,
        );
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    lessonId,
    totalDurationSeconds,
    completionThreshold,
    intervalMs,
    onComplete,
  ]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      const delta = currentTime - lastPositionRef.current;

      if (delta > 0 && delta < 5) {
        accumulatedRef.current = Math.min(
          accumulatedRef.current + delta,
          totalDurationSeconds,
        );
      }

      lastPositionRef.current = currentTime;
    },
    [totalDurationSeconds],
  );

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Flush the current accumulated time immediately on pause
    setWatchedSeconds(accumulatedRef.current);
  }, []);

  const watchPercent =
    totalDurationSeconds > 0
      ? Math.min((watchedSeconds / totalDurationSeconds) * 100, 100)
      : 0;

  return {
    watchedSeconds,
    watchPercent,
    isCompleted,
    handleTimeUpdate,
    handlePlay,
    handlePause,
  };
}
