"use client";

import { useCallback, useRef, useState } from "react";
import { useVideoHeartbeat } from "@/src/hooks/useVideoHeartbeat";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson } from "@/src/components/page/student/courses/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ILessonContentProps {
  lessonId: string;
  onCompletionChange?: (isCompleted: boolean) => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function findLesson(lessonId: string): ILesson | null {
  const id = parseInt(lessonId, 10);
  for (const mod of COURSE_DETAIL.modules) {
    const found = mod.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return null;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ─── Video Player Component ───────────────────────────────────────────────────

interface VideoPlayerProps {
  lesson: ILesson;
  watchPercent: number;
  isCompleted: boolean;
  onTimeUpdate: (currentTime: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

function VideoPlayer({ lesson, watchPercent, isCompleted, onTimeUpdate, onPlay, onPause }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause();
  }, [onPause]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  return (
    <div className="relative w-full aspect-video bg-[#0f172a] rounded-2xl overflow-hidden mb-8 shadow-lg group">
      {/* Actual video element — using a placeholder src for demo */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        playsInline
        preload="metadata"
      >
        {/* In production, replace with real video URL from API */}
        <source src="" type="video/mp4" />
      </video>

      {/* Overlay background (shown when video isn't playing yet or no src) */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </div>
      </button>

      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-bold shadow-lg">
          <CheckCircleIcon className="w-3.5 h-3.5" />
          Completed
        </div>
      )}

      {/* Bottom: Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${watchPercent}%`,
                background: isCompleted
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #6b6bff, #a78bfa)",
              }}
            />
          </div>
          <span className="text-[11px] font-bold text-white/80 shrink-0 tabular-nums">
            {Math.round(watchPercent)}%
          </span>
        </div>

        {/* Completion threshold hint */}
        {!isCompleted && watchPercent < 90 && (
          <p className="text-[10px] text-white/50 mt-1">
            Watch {Math.ceil(90 - watchPercent)}% more to mark as completed
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Code Block Component ─────────────────────────────────────────────────────

function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const code = `export async function GET(request: Request) {\n  return Response.json({ message: 'Hello, Next.js!' }, { status: 200 })\n}`;
    await navigator.clipboard.writeText(code).catch(console.error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="bg-[#0D1117] rounded-xl overflow-hidden shadow-sm border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-gray-800">
        <span className="text-xs text-gray-400 font-mono">app/api/route.ts</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
          title="Copy code"
        >
          {copied ? (
            <>
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-gray-300">
          <code>
            <span className="text-[#FF7B72]">export</span>{" "}
            <span className="text-[#FF7B72]">async</span>{" "}
            <span className="text-[#FF7B72]">function</span>{" "}
            <span className="text-[#D2A8FF]">GET</span>
            <span className="text-gray-300">(</span>
            <span className="text-[#FFA657]">request</span>
            <span className="text-[#FF7B72]">:</span>{" "}
            <span className="text-[#79C0FF]">Request</span>
            <span className="text-gray-300">) </span>
            <span className="text-gray-300">{"{"}</span>
            {"\n"}
            {"  "}
            <span className="text-[#FF7B72]">return</span>{" "}
            <span className="text-[#79C0FF]">Response</span>
            <span className="text-gray-300">.json(</span>
            <span className="text-gray-300">{"{"}</span>{" "}
            <span className="text-[#79C0FF]">message</span>
            <span className="text-gray-300">:</span>{" "}
            <span className="text-[#A5D6FF]">{"'Hello, Next.js!'"}</span>{" "}
            <span className="text-gray-300">{"}"}</span>
            <span className="text-gray-300">, {"{"}</span>
            {"\n"}
            {"    "}
            <span className="text-gray-300">status:</span>{" "}
            <span className="text-[#79C0FF]">200</span>
            {"\n"}
            {"  "}
            <span className="text-gray-300">{"}"}</span>
            <span className="text-gray-300">)</span>
            {"\n"}
            <span className="text-gray-300">{"}"}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonContent({ lessonId, onCompletionChange }: ILessonContentProps) {
  const lesson = findLesson(lessonId);

  const handleComplete = useCallback((id: number) => {
    console.info(`[LessonContent] Lesson ${id} completed — updating server state`);
    onCompletionChange?.(true);
  }, [onCompletionChange]);

  const {
    watchPercent,
    isCompleted,
    handleTimeUpdate,
    handlePlay,
    handlePause,
  } = useVideoHeartbeat({
    lessonId: lesson?.id ?? parseInt(lessonId, 10),
    totalDurationSeconds: lesson?.videoDurationSeconds ?? 900,
    initialWatchedSeconds: lesson?.watchedSeconds ?? 0,
    intervalMs: 15_000,
    completionThreshold: 0.9,
    onComplete: handleComplete,
  });

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (!lesson) {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[#9CA3AF] text-lg font-semibold">Lesson not found</p>
          <p className="text-[#D1D5DB] text-sm mt-1">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      <div className="p-8 max-w-4xl mx-auto pb-32">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5]">
            {COURSE_DETAIL.title}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFEFF] text-[#0891B2]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {COURSE_DETAIL.level}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {lesson.duration}
          </span>
          {lesson.status === "completed" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
              <CheckCircleIcon className="w-3 h-3" />
              Previously Completed
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Learn how to create custom request handlers for a given route using
          the Web Request and Response APIs. Route Handlers are available only
          inside the app directory.
        </p>

        {/* Video Player with Heartbeat Integration */}
        <VideoPlayer
          lesson={lesson}
          watchPercent={watchPercent}
          isCompleted={isCompleted}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
        />

        {/* 90% Completion Banner */}
        {isCompleted && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[14px] font-bold text-emerald-700">Lesson Unlocked for Completion</p>
              <p className="text-[13px] text-emerald-600">You've watched enough of this lesson. Click "Mark as Completed" below to advance.</p>
            </div>
          </div>
        )}

        {/* Subheading & Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Handling Requests</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Route Handlers allow you to create custom request handlers for a given
          route using the Web Request and Response APIs. They are the equivalent
          of API Routes in the Pages Router, but they are defined inside the app
          directory.
        </p>

        {/* Code Block */}
        <CodeBlock />
      </div>
    </div>
  );
}
