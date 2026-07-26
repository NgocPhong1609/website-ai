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

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  codeSnippet?: string;
  diagramTitle?: string;
  timestamp: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonContent({ lessonId, onCompletionChange }: LessonContentProps) {
  const numericId = parseInt(lessonId, 10) || 101;
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  
  // Video Player custom controls state (Section 2.2)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isPipMode, setIsPipMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // AI Side-Panel state (Section 3.1)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: `Hello! I am your MindNova AI Tutor (RAG Context-Aware). I'm currently tuned to Lesson #${numericId} • Route Handlers & Server Architecture at 00:00. How can I assist your deep dive today?`,
      timestamp: "Just now",
    },
  ]);
  const [aiThinking, setAiThinking] = useState(false);

  // Celebratory Certificate Modal & Slide-in Rating Prompt state (Sections 2.1 & 5.1)
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [ratingStars, setRatingStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Utilize Video Heartbeat hook (strict rule: minimum watch time e.g. 80%)
  const { watchPercent, isCompleted, handlePlay, handlePause, handleTimeUpdate } =
    useVideoHeartbeat({
      lessonId: numericId,
      totalDurationSeconds: 300, // 5 minute video simulation
      onComplete: () => {
        console.info(`[LessonContent] Video threshold reached (≥80%) for lesson #${numericId}. Unlocking certification.`);
        onCompletionChange?.(true);
        setShowCertificateModal(true);
      },
    });

  // Check eligibility threshold for Rating Prompt (>= 20% progress)
  useEffect(() => {
    if (watchPercent >= 20 && !ratingSubmitted && !showRatingPrompt) {
      setShowRatingPrompt(true);
    }
  }, [watchPercent, ratingSubmitted, showRatingPrompt]);

  useEffect(() => {
    onCompletionChange?.(isCompleted);
  }, [isCompleted, onCompletionChange]);

  const togglePlayState = () => {
    if (isPlaying) {
      setIsPlaying(false);
      handlePause();
      if (videoRef.current) videoRef.current.pause();
    } else {
      setIsPlaying(true);
      handlePlay();
      if (videoRef.current) videoRef.current.play();
      // Simulate stepping watch percentage forward on play
      handleTimeUpdate(245); // Jump above 80% to showcase real-time certification trigger
    }
  };

  const cycleSpeed = () => {
    if (playbackSpeed === "1x") setPlaybackSpeed("1.5x");
    else if (playbackSpeed === "1.5x") setPlaybackSpeed("2x");
    else setPlaybackSpeed("1x");
  };

  const handleJumpToTime = (seconds: number) => {
    handleTimeUpdate(seconds);
    if (videoRef.current) videoRef.current.currentTime = seconds;
  };

  // AI Tutor Quick Prompts execution (Section 3.1)
  const executeQuickPrompt = (type: "summarize" | "explain" | "example") => {
    setIsAiPanelOpen(true);
    let userText = "";
    let aiResponse: ChatMessage;

    if (type === "summarize") {
      userText = "⚡ Summarize this lesson in 3 key takeaways.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Here is the RAG distillation for Route Handlers:\n1. Replaces legacy API routes in App Router using native Web Request/Response objects.\n2. Functions export named HTTP verbs (GET, POST, PUT, DELETE).\n3. Automatically cached unless using dynamic functions like cookies() or headers().",
        timestamp: "Just now",
      };
    } else if (type === "explain") {
      userText = "🧠 Explain this concept simply using a real-world analogy.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Think of a Route Handler as a dedicated automated receptionist at a modern office desk. Instead of one general receptionist guessing what you need, there's a labeled counter for GET (asking for brochures), POST (dropping off new applications), and DELETE (canceling tickets).",
        timestamp: "Just now",
      };
    } else {
      userText = "💻 Give me a practical backend architectural code example.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Here is a production-grade webhook validator utilizing Route Handlers and NextRequest signature verification:",
        codeSnippet: `import { NextRequest, NextResponse } from "next/server";\nimport crypto from "crypto";\n\nexport async function POST(req: NextRequest) {\n  const payload = await req.text();\n  const sig = req.headers.get("x-signature") || "";\n  // Validate HMAC cryptographic token\n  const expected = crypto.createHmac("sha256", process.env.SECRET!).update(payload).digest("hex");\n  if (sig !== expected) return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });\n  return NextResponse.json({ status: "Webhook Processed" }, { status: 200 });\n}`,
        diagramTitle: "Diagram: Webhook -> Route Handler [Verify HMAC] -> Database Mutation",
        timestamp: "Just now",
      };
    }

    setMessages((prev) => [...prev, { id: Date.now() + "-u", sender: "user", text: userText, timestamp: "Just now" }]);
    setAiThinking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      setAiThinking(false);
    }, 600);
  };

  const handleSendCustomMessage = () => {
    if (!chatInput.trim() || aiThinking) return;
    const newMsg: ChatMessage = { id: Date.now() + "-u", sender: "user", text: chatInput, timestamp: "Just now" };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setAiThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-ai",
          sender: "ai",
          text: `[RAG Context: timestamp 03:45] Regarding "${newMsg.text}": In Next.js 15, route handlers execute inside an isolated Edge or Node runtime depending on your export config. Let me know if you want to inspect the unit test harness!`,
          timestamp: "Just now",
        },
      ]);
      setAiThinking(false);
    }, 700);
  };

  const submitRating = () => {
    setRatingSubmitted(true);
    setShowRatingPrompt(false);
    console.info(`[Course Rating] User submitted ${ratingStars} stars: ${reviewText}`);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#0A0D14] text-gray-200 overflow-y-auto">
      {/* Top Master Progress Bar (Section 2.1) */}
      <div className="sticky top-0 z-40 bg-[#131926]/95 backdrop-blur-md border-b border-gray-800 px-6 py-3.5 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#6B6BFF] animate-ping" />
          <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-[#A5D6FF]">Theater Mode</span>
            <span className="text-gray-600">|</span>
            <span>Lesson #{numericId}: Route Handlers in Next.js</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <div className="flex items-center gap-2 bg-[#0A0D14] px-3 py-1.5 rounded-xl border border-gray-800">
            <span className="text-gray-400">Watch Target: ≥ 80%</span>
            <span className={`px-2 py-0.5 rounded-md ${watchPercent >= 80 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300"}`}>
              {watchPercent.toFixed(0)}% Completed
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAiPanelOpen((v) => !v)}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              isAiPanelOpen ? "bg-[#6B6BFF] text-white shadow-md shadow-[#6B6BFF]/30" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            <span>🤖 AI Tutor Panel</span>
            <span>{isAiPanelOpen ? "◀" : "▶"}</span>
          </button>
        </div>
      </div>

      {/* Main Theater Layout Grid (Video Player + AI Side-Panel) */}
      <div className="max-w-[1700px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Distraction-Free Video Player & Tabs */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          {/* Video Player Canvas */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#121622] border border-gray-800/80 shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 group">
            {/* Top Video overlay tag */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>HD • 1080p Stream</span>
              </span>
              <div className="flex items-center gap-2">
                {isPipMode && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                    📺 PiP Active
                  </span>
                )}
                {captionsEnabled && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    CC ON (English)
                  </span>
                )}
              </div>
            </div>

            {/* Play / Pause Interactive Center */}
            <div className="my-auto text-center flex flex-col items-center gap-4 z-10">
              <button
                type="button"
                onClick={togglePlayState}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6B6BFF] to-[#22D3EE] text-white flex items-center justify-center shadow-[0_0_40px_rgba(107,107,255,0.6)] hover:scale-110 active:scale-95 transition-all"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <p className="text-sm font-semibold text-gray-300 max-w-md backdrop-blur-xs bg-black/30 px-4 py-1.5 rounded-xl border border-white/5">
                {isPlaying ? "Syncing watch time to cryptographic learning ledger..." : "Click to initialize lesson stream & progress tracking."}
              </p>
            </div>

            {/* Closed Captions Subtitle Simulation Bar */}
            {isPlaying && captionsEnabled && (
              <div className="mx-auto max-w-2xl bg-black/80 text-amber-300 text-sm font-bold text-center px-6 py-2 rounded-2xl border border-amber-500/30 backdrop-blur-md shadow-lg mb-2 z-10 animate-fadeIn">
                &quot;When initializing an asynchronous POST route handler in Next.js 15, ensure you await req.json()...&quot;
              </div>
            )}

            {/* Bottom Controls Bar (Section 2.2 Speed controls 1x, 1.5x, 2x, CC, PiP, Flag) */}
            <div className="z-10 flex flex-col gap-2.5 bg-black/60 p-3.5 rounded-2xl backdrop-blur-md border border-white/10">
              {/* Scrubbing Progress Bar */}
              <div
                className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden cursor-pointer relative group/bar"
                onClick={() => handleTimeUpdate(280)}
                role="progressbar"
                aria-valuenow={Math.round(watchPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#6B6BFF] via-[#5249DE] to-[#22D3EE] transition-all duration-300"
                  style={{ width: `${Math.min(100, watchPercent)}%` }}
                />
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-300 px-1">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlayState} className="hover:text-white transition-colors flex items-center gap-1.5 text-sm">
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                  <span className="font-mono text-indigo-300">04:12 / 05:00</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Control (1x, 1.5x, 2x) */}
                  <button
                    type="button"
                    onClick={cycleSpeed}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono transition-colors border border-white/15"
                    title="Change Playback Speed (1x, 1.5x, 2x)"
                  >
                    ⚡ {playbackSpeed}
                  </button>

                  {/* Closed Captions toggle */}
                  <button
                    type="button"
                    onClick={() => setCaptionsEnabled((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg font-extrabold transition-all border ${
                      captionsEnabled
                        ? "bg-[#6B6BFF] text-white border-[#6B6BFF]"
                        : "bg-white/10 text-gray-400 hover:text-white border-white/10"
                    }`}
                    title="Toggle Closed Captions (CC)"
                  >
                    CC
                  </button>

                  {/* PiP Mode */}
                  <button
                    type="button"
                    onClick={() => setIsPipMode((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all border ${
                      isPipMode ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/10 text-gray-300 hover:bg-white/20 border-white/10"
                    }`}
                    title="Toggle Picture-in-Picture (PiP) Mode"
                  >
                    PiP
                  </button>

                  {/* Discreet Content Reporting Flag (Section 5.2) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("report")}
                    className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 transition-colors flex items-center gap-1"
                    title="Report Broken Video, Audio Glitch, or Transcript Typo"
                  >
                    <span>⚑</span>
                    <span className="hidden sm:inline">Flag Issue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Prompts Below Video (Section 3.1) */}
          <div className="flex flex-col gap-3 p-5 rounded-3xl bg-[#131926] border border-gray-800/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#A5D6FF] tracking-wider uppercase flex items-center gap-1.5">
                <span>🤖 AI Quick Prompts (Instant RAG Context Engine)</span>
              </span>
              <span className="text-[11px] text-gray-400">Click to run in Side-Panel</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "summarize", label: "⚡ Summarize this lesson", bg: "hover:border-[#6B6BFF] text-[#A5D6FF]" },
                { id: "explain", label: "🧠 Explain simply (Analogy)", bg: "hover:border-emerald-400 text-emerald-300" },
                { id: "example", label: "💻 Pull Code Example & Diagram", bg: "hover:border-cyan-400 text-cyan-300" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => executeQuickPrompt(btn.id as "summarize" | "explain" | "example")}
                  className={`p-3 rounded-2xl bg-[#1A2234] border border-gray-700/80 text-xs font-extrabold text-left transition-all hover:scale-[1.02] shadow-sm flex items-center justify-between ${btn.bg}`}
                >
                  <span>{btn.label}</span>
                  <span>➔</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation & Content */}
          <div className="flex items-center gap-3 border-b border-gray-800 pb-px">
            {[
              { id: "overview", label: "Lesson Overview", icon: "📄" },
              { id: "discussions", label: "Timestamp Discussions", icon: "💬" },
              { id: "report", label: "Report Content Error", icon: "⚑" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-6 py-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "text-[#6B6BFF] border-[#6B6BFF] bg-[#6B6BFF]/10 rounded-t-xl"
                    : "text-gray-400 border-transparent hover:text-gray-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="pb-12">
            {activeTab === "overview" && (
              <div className="rounded-3xl bg-[#121622] border border-gray-800 p-8 text-gray-300 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Understanding Route Handlers & Edge Runtime
                  </h2>
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified Syllabus
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-300 font-medium">
                  Route Handlers allow you to create custom request handlers for a given route using the native Web Request and Response APIs. Essential for webhook validation, external OAuth transformations, and high-security backend endpoints.
                </p>
                <div className="p-5 rounded-2xl bg-[#0B0E17] border border-gray-800 text-indigo-300 font-mono text-xs shadow-inner space-y-2">
                  <div className="text-gray-500">// Example: app/api/webhook/route.ts</div>
                  <div className="text-emerald-400">{"export async function POST(req: NextRequest) {"}</div>
                  <div className="pl-4">{"const body = await req.json();"}</div>
                  <div className="pl-4">{"return NextResponse.json({ success: true, timestamp: Date.now() });"}</div>
                  <div className="text-emerald-400">{"}"}</div>
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

        {/* Right Column: Collapsible Contextual AI Chat Side-Panel (Section 3.1) */}
        {isAiPanelOpen && (
          <aside className="w-full lg:w-[420px] shrink-0 bg-[#121622] border border-gray-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px] lg:sticky lg:top-20 animate-fadeIn">
            {/* AI Panel Header */}
            <div className="p-4 bg-gradient-to-r from-[#1A2236] via-[#2D2D60] to-[#1A2236] border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#22D3EE] flex items-center justify-center text-white font-black text-lg shadow-md">
                  🧠
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">MindNova AI Tutor</h3>
                  <p className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>RAG Tuned • Lesson #{numericId}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center font-bold text-sm"
                title="Collapse AI Side-Panel"
              >
                ✕
              </button>
            </div>

            {/* AI Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col bg-[#0C1018]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 max-w-[92%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#6B6BFF] to-[#4F46E5] text-white rounded-br-sm"
                        : "bg-[#182032] text-gray-200 border border-gray-700/80 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Pulls Code Snippets directly in Chat (Section 3.1) */}
                    {msg.codeSnippet && (
                      <div className="mt-3 p-3.5 rounded-xl bg-black/80 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] overflow-x-auto shadow-inner">
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-1">// Production Architecture Snippet</div>
                        <pre className="leading-normal">{msg.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Pulls Architectural Diagrams (Section 3.1) */}
                    {msg.diagramTitle && (
                      <div className="mt-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-extrabold text-[11px] flex items-center gap-2">
                        <span>🗺️</span>
                        <span>{msg.diagramTitle}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold px-1">{msg.sender === "user" ? "You" : "MindNova Tutor"} • {msg.timestamp}</span>
                </div>
              ))}

              {aiThinking && (
                <div className="self-start p-4 rounded-2xl bg-[#182032] border border-gray-700 text-gray-400 text-xs font-bold flex items-center gap-2 animate-pulse">
                  <span>🤖</span>
                  <span>Synthesizing codebase transcript & architectural rubrics...</span>
                </div>
              )}
            </div>

            {/* AI Chat Input Footer */}
            <div className="p-3.5 bg-[#121622] border-t border-gray-800/80">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendCustomMessage(); }}
                  placeholder="Ask any question about this lesson timestamp..."
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#0A0E17] border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6B6BFF] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={handleSendCustomMessage}
                  disabled={!chatInput.trim() || aiThinking}
                  className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-xl bg-[#6B6BFF] hover:bg-[#5249DE] disabled:bg-gray-800 text-white text-xs font-bold transition-all flex items-center justify-center"
                >
                  ➔
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Elegant Slide-in Rating & Review Prompt (Section 5.1 - >=20% completion threshold) */}
      {showRatingPrompt && !ratingSubmitted && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#1E233E] via-[#252A4E] to-[#1E233E] border border-indigo-400/40 p-6 text-white shadow-[0_12px_45px_rgba(0,0,0,0.8)] animate-slideUp flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#6B6BFF] text-white tracking-widest shadow-sm">
              ⭐ Verified Eligibility (≥20% Watched)
            </span>
            <button
              onClick={() => setShowRatingPrompt(false)}
              className="text-gray-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>
          </div>
          <div>
            <h4 className="text-base font-black text-white leading-tight">How is your learning journey going?</h4>
            <p className="text-xs text-indigo-200 mt-1">Your review will appear with verified student badge.</p>
          </div>

          {/* Star Selector */}
          <div className="flex items-center justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingStars(star)}
                className={`text-3xl transition-transform hover:scale-125 focus:outline-none ${star <= ratingStars ? "text-amber-400" : "text-gray-600"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your authentic feedback on course clarity & exercises..."
            className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#6B6BFF]"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRatingPrompt(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10"
            >
              Later
            </button>
            <button
              type="button"
              onClick={submitRating}
              disabled={ratingStars === 0}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#6B6BFF] to-[#22D3EE] hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-md"
            >
              Submit Verified Review
            </button>
          </div>
        </div>
      )}

      {/* Celebratory Certificate Completion Modal (Section 2.1) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#1E2538] to-[#121722] border-2 border-[#6B6BFF] p-8 text-white shadow-[0_0_80px_rgba(107,107,255,0.5)] flex flex-col items-center text-center gap-6 relative overflow-hidden">
            {/* Background glowing particles */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-[#6B6BFF] to-emerald-400 p-1 shadow-lg flex items-center justify-center text-4xl animate-bounce">
              🎓
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-black uppercase tracking-wider shadow-sm">
                100% Mastery Confirmed
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-3">
                Cryptographic Certificate Issued!
              </h3>
              <p className="text-xs text-indigo-200 mt-2 max-w-md leading-relaxed">
                You have passed all strict watch time gates and automated quiz verifications for <strong className="text-white">Next.js 15 Fullstack Architecture</strong>.
              </p>
            </div>

            {/* Certificate Preview Card */}
            <div className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#171C2B] via-[#1E2437] to-[#171C2B] border border-amber-400/40 text-left relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-xs text-amber-300 font-mono font-bold">
                <span>VERIFIED CRYPTOGRAPHIC HASH</span>
                <span>SHA-256</span>
              </div>
              <p className="font-mono text-xs text-indigo-200 mt-1 truncate">
                8f7a90bc241c88d0a3d5e9b72a6a1c...
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Student: Hieu Nguyen</span>
                <span className="text-emerald-400 font-black">Date: July 2026</span>
              </div>
            </div>

            {/* One-click share & download CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => alert("Simulating one-click PDF Certificate download with embedded cryptographic watermark...")}
                className="flex-1 py-3.5 px-5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-[#6B6BFF] to-[#5249DE] hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>📄 Download PDF Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Opening one-click LinkedIn Profile Certifications share portal...")}
                className="flex-1 py-3.5 px-5 rounded-2xl text-xs font-black text-white bg-[#0A66C2] hover:bg-[#004182] hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>💼 Share to LinkedIn</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="text-xs text-gray-400 hover:text-white font-bold transition-colors pt-2"
            >
              Continue Exploring Dashboard ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
