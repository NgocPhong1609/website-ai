"use client";

import { useState, useRef, useEffect } from "react";
import { useVideoHeartbeat } from "@/src/hooks/useVideoHeartbeat";
import { LessonComments } from "./LessonComments";
import { ReportContentError } from "./ReportContentError";

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

export function LessonContent({ lessonId, onCompletionChange }: LessonContentProps) {
  const numericId = parseInt(lessonId, 10) || 101;
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isPipMode, setIsPipMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: `Xin chào! Tôi là Gia sư AI MindNova (Nhận thức theo ngữ cảnh RAG). Hiện tôi đang được tinh chỉnh theo Bài học #${numericId} • Route Handlers & Kiến trúc Server tại mốc 00:00. Bạn muốn khám phá điều gì trong buổi học hôm nay?`,
      timestamp: "Vừa xong",
    },
  ]);
  const [aiThinking, setAiThinking] = useState(false);

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [ratingStars, setRatingStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const { watchPercent, isCompleted, handlePlay, handlePause, handleTimeUpdate } =
    useVideoHeartbeat({
      lessonId: numericId,
      totalDurationSeconds: 300,
      onComplete: () => {
        onCompletionChange?.(true);
        setShowCertificateModal(true);
      },
    });

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
      handleTimeUpdate(245);
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

  const executeQuickPrompt = (type: "summarize" | "explain" | "example") => {
    setIsAiPanelOpen(true);
    let userText = "";
    let aiResponse: ChatMessage;

    if (type === "summarize") {
      userText = "⚡ Tóm tắt bài học này thành 3 điểm chính cốt lõi.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Đây là bản chắt lọc RAG về Route Handlers:\n1. Thay thế API routes truyền thống trong App Router bằng Web Request/Response gốc.\n2. Các hàm xuất phương thức HTTP tường minh (GET, POST, PUT, DELETE).\n3. Được cache tự động trừ khi dùng cookies() hoặc headers().",
        timestamp: "Vừa xong",
      };
    } else if (type === "explain") {
      userText = "🧠 Giải thích đơn giản bằng ví dụ thực tế.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Route Handler như lễ tân chuyên nghiệp: mỗi quầy có nhãn riêng — GET (lấy thông tin), POST (gửi đơn mới), DELETE (hủy yêu cầu). Không còn một lễ tân đa năng đoán mò nữa!",
        timestamp: "Vừa xong",
      };
    } else {
      userText = "💻 Cho tôi ví dụ code kiến trúc backend thực chiến.";
      aiResponse = {
        id: Date.now() + "-ai",
        sender: "ai",
        text: "Bộ xác thực webhook chuẩn production với Route Handlers và chữ ký NextRequest:",
        codeSnippet: `import { NextRequest, NextResponse } from "next/server";\nimport crypto from "crypto";\n\nexport async function POST(req: NextRequest) {\n  const payload = await req.text();\n  const sig = req.headers.get("x-signature") || "";\n  const expected = crypto.createHmac("sha256", process.env.SECRET!)\n    .update(payload).digest("hex");\n  if (sig !== expected)\n    return NextResponse.json({ error: "Chữ ký không hợp lệ" }, { status: 401 });\n  return NextResponse.json({ status: "Webhook đã xử lý" }, { status: 200 });\n}`,
        diagramTitle: "Sơ đồ: Webhook → Route Handler [Xác thực HMAC] → Database",
        timestamp: "Vừa xong",
      };
    }

    setMessages((prev) => [...prev, { id: Date.now() + "-u", sender: "user", text: userText, timestamp: "Vừa xong" }]);
    setAiThinking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      setAiThinking(false);
    }, 600);
  };

  const handleSendCustomMessage = () => {
    if (!chatInput.trim() || aiThinking) return;
    const newMsg: ChatMessage = { id: Date.now() + "-u", sender: "user", text: chatInput, timestamp: "Vừa xong" };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setAiThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-ai",
          sender: "ai",
          text: `[Ngữ cảnh RAG: mốc 03:45] Về "${newMsg.text}": Trong Next.js 15, route handlers chạy trong Edge hoặc Node runtime tuỳ config. Bạn có muốn xem bộ test unit không?`,
          timestamp: "Vừa xong",
        },
      ]);
      setAiThinking(false);
    }, 700);
  };

  const submitRating = () => {
    setRatingSubmitted(true);
    setShowRatingPrompt(false);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#F4F4F8] overflow-y-auto">

      {/* ── Sticky Top Bar ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] animate-ping shrink-0" />
          <h1 className="text-sm font-black text-gray-900 tracking-tight truncate flex items-center gap-2">
            <span className="text-[#4F46E5] font-mono shrink-0">Phòng Học</span>
            <span className="text-gray-300 shrink-0">|</span>
            <span className="truncate">Bài #{numericId}: Route Handlers trong Next.js</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="text-gray-500">Mục tiêu: ≥80%</span>
            <span className={`px-2 py-0.5 rounded-lg font-black ${watchPercent >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
              {watchPercent.toFixed(0)}% Hoàn thành
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAiPanelOpen((v) => !v)}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-extrabold cursor-pointer ${
              isAiPanelOpen
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            }`}
          >
            <span>🤖 Gia Sư AI</span>
            <span>{isAiPanelOpen ? "◀" : "▶"}</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────────── */}
      <div className="max-w-[1700px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 items-start">

        {/* Left: Video + Tabs */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-5">

          {/* Video Player Canvas — kept dark for immersive UX */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm flex flex-col justify-between p-5 group">
            {/* Top overlay badges */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-black/70 text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                HD • 1080p
              </span>
              <div className="flex items-center gap-2">
                {isPipMode && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 animate-pulse">
                    📺 PiP Bật
                  </span>
                )}
                {captionsEnabled && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
                    CC BẬT (Tiếng Việt)
                  </span>
                )}
              </div>
            </div>

            {/* Center Play Button */}
            <div className="my-auto text-center flex flex-col items-center gap-3 z-10">
              <button
                type="button"
                onClick={togglePlayState}
                className="w-20 h-20 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.45)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
              >
                {isPlaying ? (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <p className="text-xs font-semibold text-gray-400 bg-black/50 px-4 py-1.5 rounded-xl border border-white/5">
                {isPlaying ? "Đang đồng bộ tiến độ học tập..." : "Nhấn để bắt đầu phát bài giảng & ghi nhận tiến độ."}
              </p>
            </div>

            {/* Captions */}
            {isPlaying && captionsEnabled && (
              <div className="mx-auto max-w-2xl bg-black/80 text-amber-300 text-xs font-bold text-center px-6 py-2 rounded-xl border border-amber-500/30 backdrop-blur-md mb-2 z-10">
                &quot;Khi khởi tạo route handler POST trong Next.js 15, cần await req.json()...&quot;
              </div>
            )}

            {/* Controls Bar */}
            <div className="z-10 flex flex-col gap-2 bg-black/65 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <div
                className="w-full h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                onClick={() => handleTimeUpdate(280)}
                role="progressbar"
                aria-valuenow={Math.round(watchPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-[#4F46E5] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, watchPercent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-300 px-1">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={togglePlayState} className="hover:text-white transition-colors cursor-pointer">
                    {isPlaying ? "⏸ Tạm dừng" : "▶ Phát"}
                  </button>
                  <span className="font-mono text-indigo-300">04:12 / 05:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={cycleSpeed} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono transition-colors border border-white/15 cursor-pointer" title="Tốc độ phát">
                    ⚡ {playbackSpeed}
                  </button>
                  <button type="button" onClick={() => setCaptionsEnabled((v) => !v)} className={`px-2.5 py-1 rounded-lg font-extrabold transition-all border cursor-pointer ${captionsEnabled ? "bg-[#4F46E5] text-white border-[#4F46E5]" : "bg-white/10 text-gray-400 border-white/10"}`} title="Bật/tắt phụ đề">
                    CC
                  </button>
                  <button type="button" onClick={() => setIsPipMode((v) => !v)} className={`px-2.5 py-1 rounded-lg font-bold transition-all border cursor-pointer ${isPipMode ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/10 text-gray-300 border-white/10"}`} title="Hình-trong-Hình">
                    PiP
                  </button>
                  <button type="button" onClick={() => setActiveTab("report")} className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 transition-colors flex items-center gap-1 cursor-pointer" title="Báo cáo lỗi">
                    <span>⚑</span>
                    <span className="hidden sm:inline">Báo lỗi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Quick Prompts — light card */}
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#4F46E5] tracking-wider uppercase flex items-center gap-1.5">
                <span>🤖</span>
                <span>Câu hỏi nhanh AI (Bộ máy RAG nhận thức ngữ cảnh)</span>
              </span>
              <span className="text-[11px] text-gray-400 font-medium">Nhấn để mở bảng trả lời</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "summarize", label: "⚡ Tóm tắt bài học này", style: "hover:border-[#4F46E5] hover:bg-indigo-50 text-[#4F46E5]" },
                { id: "explain",   label: "🧠 Giải thích đơn giản (Ví dụ thực tế)", style: "hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700" },
                { id: "example",   label: "💻 Xem Code & Sơ đồ kiến trúc", style: "hover:border-cyan-400 hover:bg-cyan-50 text-cyan-700" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => executeQuickPrompt(btn.id as "summarize" | "explain" | "example")}
                  className={`p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-extrabold text-left transition-all hover:scale-[1.02] shadow-2xs flex items-center justify-between cursor-pointer ${btn.style}`}
                >
                  <span>{btn.label}</span>
                  <span>➔</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation — light */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-2xs">
            {[
              { id: "overview",     label: "Tổng quan bài giảng",          icon: "📄" },
              { id: "discussions",  label: "Bình luận theo mốc thời gian",  icon: "💬" },
              { id: "report",       label: "Báo cáo lỗi nội dung",          icon: "⚑" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex-1 px-4 py-2.5 text-xs font-black flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-12">
            {activeTab === "overview" && (
              <div className="rounded-2xl bg-white border border-gray-200 p-7 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">
                    Hiểu về Route Handlers &amp; Edge Runtime trong Next.js 15
                  </h2>
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    ✓ Chương trình Đã xác thực
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 font-medium">
                  Route Handlers cho phép bạn tạo bộ xử lý yêu cầu tùy chỉnh cho từng route bằng Web Request và Response API gốc. Thiết yếu cho webhook, OAuth và endpoint backend bảo mật cao.
                </p>

                {/* Code block stays dark — appropriate for terminal/code */}
                <div className="p-5 rounded-xl bg-gray-900 border border-gray-700 text-indigo-300 font-mono text-xs shadow-inner space-y-2">
                  <div className="text-gray-500">{"// Ví dụ: app/api/webhook/route.ts"}</div>
                  <div className="text-emerald-400">{"export async function POST(req: NextRequest) {"}</div>
                  <div className="pl-4 text-gray-300">{"const body = await req.json();"}</div>
                  <div className="pl-4 text-gray-300">{"return NextResponse.json({ success: true, timestamp: Date.now() });"}</div>
                  <div className="text-emerald-400">{"}"}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { label: "Thời lượng", value: "05:00 phút" },
                    { label: "Cấp độ", value: "Nâng cao" },
                    { label: "Tiến độ hiện tại", value: `${watchPercent.toFixed(0)}% Đã xem` },
                  ].map((item) => (
                    <div key={item.label} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
                      <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-sm font-black text-gray-900">{item.value}</p>
                    </div>
                  ))}
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

        {/* Right: AI Tutor Chat Panel — light themed */}
        {isAiPanelOpen && (
          <aside className="w-full lg:w-[400px] shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[567px] lg:sticky lg:top-16">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white text-lg shadow-2xs">
                  🧠
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Gia Sư AI MindNova</h3>
                  <p className="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>RAG Đang hoạt động • Bài #{numericId}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                title="Thu gọn bảng Gia sư AI"
              >
                ✕
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 max-w-[92%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`p-3.5 rounded-xl text-xs font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#4F46E5] text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.codeSnippet && (
                      <div className="mt-3 p-3.5 rounded-xl bg-gray-900 border border-gray-700 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-1">// Kiến trúc Production</div>
                        <pre className="leading-normal">{msg.codeSnippet}</pre>
                      </div>
                    )}

                    {msg.diagramTitle && (
                      <div className="mt-2 p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 font-extrabold text-[11px] flex items-center gap-2">
                        <span>🗺️</span>
                        <span>{msg.diagramTitle}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold px-1">
                    {msg.sender === "user" ? "Bạn" : "Gia Sư MindNova"} • {msg.timestamp}
                  </span>
                </div>
              ))}

              {aiThinking && (
                <div className="self-start p-3.5 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-bold flex items-center gap-2 animate-pulse shadow-2xs">
                  <span>🤖</span>
                  <span>Đang tổng hợp kiến thức và kiến trúc bài giảng...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3.5 bg-white border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendCustomMessage(); }}
                  placeholder="Hỏi về bài giảng hoặc mốc thời gian bất kỳ..."
                  className="w-full pl-4 pr-14 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={handleSendCustomMessage}
                  disabled={!chatInput.trim() || aiThinking}
                  className="absolute right-2 top-1.5 bottom-1.5 px-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black transition-all flex items-center justify-center cursor-pointer"
                >
                  ➔
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Rating Prompt ─────────────────────────────────────────────────── */}
      {showRatingPrompt && !ratingSubmitted && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-black uppercase bg-[#4F46E5] text-white tracking-widest">
              ⭐ Đủ điều kiện (≥20% đã xem)
            </span>
            <button type="button" onClick={() => setShowRatingPrompt(false)} className="text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer">✕</button>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 leading-tight">Trải nghiệm học tập của bạn đang như thế nào?</h4>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Đánh giá của bạn sẽ được hiển thị với huy hiệu đã xác thực.</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRatingStars(star)} className={`text-3xl transition-transform hover:scale-125 focus:outline-none cursor-pointer ${star <= ratingStars ? "text-amber-400" : "text-gray-300"}`}>★</button>
            ))}
          </div>

          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Chia sẻ phản hồi về chất lượng bài giảng & bài tập..."
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-[#4F46E5] font-medium"
          />

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setShowRatingPrompt(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">Để sau</button>
            <button type="button" onClick={submitRating} disabled={ratingStars === 0} className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 transition-all cursor-pointer">
              Gửi đánh giá đã xác thực
            </button>
          </div>
        </div>
      )}

      {/* ── Certificate Modal ─────────────────────────────────────────────── */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-28 h-28 bg-indigo-100 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-[#4F46E5] to-emerald-400 flex items-center justify-center text-4xl animate-bounce shadow-sm">
              🎓
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-xl text-xs font-mono font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                ✓ 100% Làm chủ kiến thức
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-3">
                Chứng chỉ Blockchain Đã cấp!
              </h3>
              <p className="text-xs text-gray-600 mt-2 max-w-md leading-relaxed font-semibold">
                Bạn đã vượt qua toàn bộ cổng xác thực thời gian xem và kiểm tra tự động của <strong className="text-gray-900">Next.js 15 Fullstack Architecture</strong>.
              </p>
            </div>

            <div className="w-full p-5 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <div className="flex items-center justify-between text-xs text-amber-700 font-mono font-bold">
                <span>MÃ HASH MẬT MÃ XÁC THỰC</span>
                <span className="text-gray-500">SHA-256</span>
              </div>
              <p className="font-mono text-xs text-gray-600 mt-1 truncate">8f7a90bc241c88d0a3d5e9b72a6a1c...</p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-black text-gray-900">Học viên: Nguyễn Minh Hiếu</span>
                <span className="text-emerald-600 font-black">Tháng 8, 2026</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button type="button" onClick={() => alert("Đang tải xuống Chứng chỉ PDF...")} className="flex-1 py-3.5 px-5 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                📄 Tải xuống Chứng chỉ PDF
              </button>
              <button type="button" onClick={() => alert("Đang mở LinkedIn Certifications...")} className="flex-1 py-3.5 px-5 rounded-xl text-xs font-black text-white bg-[#0A66C2] hover:bg-[#004182] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer">
                💼 Chia sẻ lên LinkedIn
              </button>
            </div>

            <button type="button" onClick={() => setShowCertificateModal(false)} className="text-xs text-gray-400 hover:text-gray-700 font-bold transition-colors cursor-pointer">
              Tiếp tục khám phá bảng thông tin ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
