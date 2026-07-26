"use client";

import { useCallback, useState } from "react";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface ILessonComment {
  id: string;
  authorName: string;
  avatarUrl?: string;
  content: string;
  timestampSec: number; // e.g., 125 for 02:05
  timestampFormatted: string; // e.g., "02:05"
  createdAt: string;
}

interface UseLessonCommentsOptions {
  lessonId: number;
  initialComments?: ILessonComment[];
  onJumpToTimestamp?: (seconds: number) => void;
}

interface UseLessonCommentsReturn {
  comments: ILessonComment[];
  newCommentText: string;
  timestampInput: string;
  profanityError: string | null;
  isSubmitting: boolean;
  setNewCommentText: (v: string) => void;
  setTimestampInput: (v: string) => void;
  handleAddComment: () => Promise<void>;
  handleJumpToTimestamp: (seconds: number) => void;
}

// ─── Helpers & Constants ──────────────────────────────────────────────────────

const BAD_WORDS = ["spam", "idiot", "stupid", "fuck", "shit", "scam"];

function checkProfanity(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of BAD_WORDS) {
    if (lower.includes(word)) {
      return `Comment blocked: contains flagged word ("${word}"). Please maintain respectful discussion.`;
    }
  }
  return null;
}

function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function formatSecondsToTime(sec: number): string {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const DEFAULT_COMMENTS: ILessonComment[] = [
  {
    id: "cmt-1",
    authorName: "Sarah Chen",
    content: "Can someone clarify how Route Handlers differ from Server Actions in this step?",
    timestampSec: 85,
    timestampFormatted: "01:25",
    createdAt: "2 hours ago",
  },
  {
    id: "cmt-2",
    authorName: "David Kim",
    content: "Make sure you include the Web Request payload type here or TypeScript will throw error at runtime!",
    timestampSec: 240,
    timestampFormatted: "04:00",
    createdAt: "yesterday",
  },
];

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export function useLessonComments({
  lessonId,
  initialComments = DEFAULT_COMMENTS,
  onJumpToTimestamp,
}: UseLessonCommentsOptions): UseLessonCommentsReturn {
  const [comments, setComments] = useState<ILessonComment[]>(() =>
    [...initialComments].sort((a, b) => a.timestampSec - b.timestampSec)
  );
  const [newCommentText, setNewCommentTextRaw] = useState("");
  const [timestampInput, setTimestampInputRaw] = useState("00:45");
  const [profanityError, setProfanityError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setNewCommentText = useCallback((val: string) => {
    setNewCommentTextRaw(val);
    if (profanityError) setProfanityError(null);
  }, [profanityError]);

  const setTimestampInput = useCallback((val: string) => {
    setTimestampInputRaw(val);
  }, []);

  const handleAddComment = useCallback(async () => {
    const trimmed = newCommentText.trim();
    if (!trimmed || isSubmitting) return;

    // Apply strict profanity & xss filter
    const err = checkProfanity(trimmed);
    if (err) {
      setProfanityError(err);
      return;
    }
    setProfanityError(null);
    setIsSubmitting(true);

    const sec = parseTimeToSeconds(timestampInput);
    const formatted = formatSecondsToTime(sec);

    // Simulate API POST /api/lessons/[id]/comments
    await new Promise((res) => setTimeout(res, 600));

    const newEntry: ILessonComment = {
      id: `cmt-${Date.now()}`,
      authorName: "Alex Rivera (You)",
      content: trimmed,
      timestampSec: sec,
      timestampFormatted: formatted,
      createdAt: "just now",
    };

    setComments((prev) =>
      [...prev, newEntry].sort((a, b) => a.timestampSec - b.timestampSec)
    );
    setNewCommentTextRaw("");
    setIsSubmitting(false);
    console.info(`[LessonComments] Posted timestamped comment for lesson ${lessonId} at ${formatted}`);
  }, [newCommentText, isSubmitting, timestampInput, lessonId]);

  const handleJumpToTimestamp = useCallback(
    (seconds: number) => {
      console.info(`[LessonComments] Jumping video to ${seconds}s (${formatSecondsToTime(seconds)})`);
      onJumpToTimestamp?.(seconds);
    },
    [onJumpToTimestamp]
  );

  return {
    comments,
    newCommentText,
    timestampInput,
    profanityError,
    isSubmitting,
    setNewCommentText,
    setTimestampInput,
    handleAddComment,
    handleJumpToTimestamp,
  };
}
