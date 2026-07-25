"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoHeartbeatOptions {
  lessonId: number;
  totalDurationSeconds: number;
  initialWatchedSeconds?: number;
  /** Heartbeat interval in ms (default: 15000 = 15s) */
  intervalMs?: number;
  /** Completion threshold as a fraction (default: 0.9 = 90%) */
  completionThreshold?: number;
  onComplete?: (lessonId: number) => void;
}

interface UseVideoHeartbeatReturn {
  watchedSeconds: number;
  watchPercent: number;
  isCompleted: boolean;
  /** Call this on the video's timeupdate event */
  handleTimeUpdate: (currentTime: number) => void;
  /** Call this when the video starts playing */
  handlePlay: () => void;
  /** Call this when the video pauses/ends */
  handlePause: () => void;
}

/**
 * Tracks real video watch time and sends periodic heartbeats to the server.
 *
 * Core rules enforced:
 * - Heartbeat every 15s (not on every second) to simulate server-side validation
 * - watchedSeconds grows only when the video is actually playing (no skip cheating)
 * - Completion only when watchedSeconds / totalDurationSeconds >= threshold (default 90%)
 */
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
    initialWatchedSeconds / totalDurationSeconds >= completionThreshold
  );

  // Track the last known video position to accumulate only actual play time
  const lastPositionRef = useRef<number>(initialWatchedSeconds);
  const accumulatedRef = useRef<number>(initialWatchedSeconds);
  const hasCompletedRef = useRef(isCompleted);

  // ─── Heartbeat Effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const currentWatched = accumulatedRef.current;

      // Simulate sending heartbeat to API
      // In production: apiClient("/api/lessons/heartbeat", { method: "POST", body: JSON.stringify({...}) })
      console.info(
        `[Heartbeat] lessonId=${lessonId} watchedSeconds=${currentWatched} timestamp=${Date.now()}`
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
        console.info(`[Heartbeat] Lesson ${lessonId} marked COMPLETED (${currentWatched}/${totalDurationSeconds}s)`);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, lessonId, totalDurationSeconds, completionThreshold, intervalMs, onComplete]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleTimeUpdate = useCallback((currentTime: number) => {
    const delta = currentTime - lastPositionRef.current;

    // Only accumulate when the user is moving forward (not seeking backwards)
    // Allow small backward seeks (< 2s) as natural buffering, block large seeks
    if (delta > 0 && delta < 5) {
      accumulatedRef.current = Math.min(
        accumulatedRef.current + delta,
        totalDurationSeconds
      );
    }

    lastPositionRef.current = currentTime;
  }, [totalDurationSeconds]);

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
