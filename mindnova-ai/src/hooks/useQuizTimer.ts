"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseQuizTimerOptions {
  /** Total allowed seconds (calculated server-side, passed as prop) */
  durationSeconds: number;
  /** Unix ms timestamp when the quiz session was created on the server */
  startedAt: number;
  /** Called when the timer reaches 0 */
  onExpire: () => void;
  /** Whether the timer should be running */
  enabled?: boolean;
}

interface UseQuizTimerReturn {
  /** Remaining seconds */
  timeLeft: number;
  /** Formatted string "MM:SS" */
  formattedTime: string;
  isExpired: boolean;
  /** True when < 60 seconds remaining */
  isUrgent: boolean;
}

/**
 * Server-side-safe quiz timer.
 *
 * Core rule: The duration is calculated based on server-provided `startedAt`
 * timestamp, preventing client-side time manipulation. Even if the user
 * refreshes the page, the timer picks up from where it left off.
 */
export function useQuizTimer({
  durationSeconds,
  startedAt,
  onExpire,
  enabled = true,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const computeTimeLeft = useCallback(() => {
    const elapsedMs = Date.now() - startedAt;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    return Math.max(durationSeconds - elapsedSeconds, 0);
  }, [durationSeconds, startedAt]);

  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);
  const [isExpired, setIsExpired] = useState(timeLeft === 0);
  const hasExpiredRef = useRef(isExpired);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire ref fresh without re-running the effect
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!enabled || hasExpiredRef.current) return;

    const tick = () => {
      const remaining = computeTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        setIsExpired(true);
        onExpireRef.current();
      }
    };

    // Tick immediately to sync with server time
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [enabled, computeTimeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired,
    isUrgent: timeLeft > 0 && timeLeft <= 60,
  };
}
