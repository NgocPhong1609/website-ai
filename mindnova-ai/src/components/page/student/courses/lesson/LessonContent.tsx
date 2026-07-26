"use client";

import { useState, useRef, useEffect } from "react";
import { useVideoHeartbeat } from "@/src/hooks/useVideoHeartbeat";
import { LessonComments } from "./LessonComments";
import { ReportContentError } from "./ReportContentError";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

interface LessonContentProps {
  lessonId: string;
  onCompletionChange?: (canComplete: boolean) => void;
}

type ActiveTab = "overview" | "discussions" | "report";

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonContent({ lessonId, onCompletionChange }: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const numericId = parseInt(lessonId, 10) || 101;

  // Utilize Video Heartbeat hook to track watch time and enforce >= 90% threshold per learning rules
  const { watchPercent, isCompleted, handlePlay, handlePause, handleTimeUpdate } =
    useVideoHeartbeat({
      lessonId: numericId,
      totalDurationSeconds: 300, // 5 minute video simulation
      onComplete: () => {
        console.info(`[LessonContent] Video threshold (90%) reached for lesson #${numericId}. Unlocking completion.`);
        onCompletionChange?.(true);
      },
    });

  useEffect(() => {
    onCompletionChange?.(isCompleted);
  }, [isCompleted, onCompletionChange]);

  const togglePlayState = () => {
    if (isPlaying) {
      setIsPlaying(false);
      handlePause();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      handlePlay();
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handleJumpToTime = (seconds: number) => {
    handleTimeUpdate(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#0A0D12] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 flex flex-col gap-8">
        {/* Video Player Section */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#131822] border border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between p-6">
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6B6BFF]/20 text-[#A5D6FF] border border-[#6B6BFF]/40">
                Lesson #{numericId} • Route Handlers in Next.js
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#1A202D]/80 px-3 py-1.5 rounded-lg border border-gray-700">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                <span>Heartbeat: {watchPercent.toFixed(0)}% watched (Target: ≥90%)</span>
              </div>
            </div>

            {/* Simulated interactive video canvas */}
            <div className="my-auto text-center flex flex-col items-center gap-4 z-10">
              <button
                type="button"
                onClick={togglePlayState}
                className="w-16 h-16 rounded-full bg-[#6B6BFF] text-white flex items-center justify-center shadow-[0_0_30px_rgba(107,107,255,0.6)] hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/40"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <p className="text-sm font-medium text-gray-400 max-w-md">
                {isPlaying ? "Simulating lesson playback... Heartbeat syncing to server every 15s." : "Click to play lesson stream & start engagement monitoring."}
              </p>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full h-2 rounded-full bg-gray-800 overflow-hidden cursor-pointer"
              onClick={() => handleTimeUpdate(270)}
              role="progressbar"
              aria-valuenow={Math.round(watchPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-gradient-to-r from-[#6B6BFF] to-[#22D3EE] transition-all duration-300"
                style={{ width: `${Math.min(100, watchPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation (Overview / Discussions / Report Issue) */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-px">
          {[
            { id: "overview", label: "Lesson Overview", icon: "📄" },
            { id: "discussions", label: "Timestamp Discussions", icon: "💬" },
            { id: "report", label: "Report Issue", icon: "⚑" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "text-[#6B6BFF] border-[#6B6BFF] bg-[#6B6BFF]/5"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === "overview" && (
            <div className="rounded-2xl bg-[#111620] border border-gray-800 p-6 text-gray-300 space-y-4">
              <h2 className="text-xl font-bold text-white">Understanding Route Handlers & Server Architecture</h2>
              <p className="text-sm leading-relaxed">
                Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs. Good for handling webhook endpoints, external OAuth transformations, and strict server-side logic validation.
              </p>
              <div className="p-4 rounded-xl bg-[#1A2130] border border-gray-700 font-mono text-xs text-[#A5D6FF]">
                <code>{"export async function POST(req: NextRequest) { ... }"}</code>
              </div>
            </div>
          )}

          {activeTab === "discussions" && (
            <LessonComments lessonId={numericId} onJumpToTime={handleJumpToTime} />
          )}

          {activeTab === "report" && (
            <ReportContentError courseId={1} lessonId={numericId} />
          )}
        </div>
      </div>
    </div>
  );
}
