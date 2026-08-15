"use client";

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparklesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Xin chào! 👋 Tôi là **Nova**, trợ lý AI học tập của bạn.\n\nTôi có thể giúp bạn:\n• Giải thích khái niệm khó\n• Tóm tắt nội dung khóa học\n• Kiểm tra kiến thức bằng câu hỏi\n• Lập kế hoạch học tập\n\nBạn cần hỗ trợ gì hôm nay?",
    time: getTime(),
  },
];

const QUICK_ACTIONS = [
  { label: "📊 Tổng hợp tiến độ", prompt: "Tổng hợp tiến độ học tập của tôi" },
  { label: "🧠 Kiểm tra kiến thức", prompt: "Hãy kiểm tra kiến thức của tôi" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const history = messages
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));

    let responseText: string;
    try {
      const { data } = await axiosClient.post<{ reply: string }>("/ai-chat", {
        message: trimmed,
        history,
      });
      responseText = data.reply;
    } catch {
      responseText =
        "Xin lỗi, Nova hiện không thể kết nối tới dịch vụ AI. Vui lòng thử lại sau. 🙏";
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      time: getTime(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => setMessages(INITIAL_MESSAGES);

  // Format bold **text** in messages
  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 z-50 flex flex-col bg-white rounded-2xl shadow-[0_8px_40px_rgba(107,107,255,0.18)] border border-[#EAEAF4] overflow-hidden"
          style={{ width: 340, height: 480 }}
          role="dialog"
          aria-label="Nova AI Co-Pilot"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#4143CB] to-[#6B6BFF] shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <SparklesIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold text-white truncate">
                  Nova AI Co-Pilot
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0" />
              </div>
              <p className="text-[10px] text-white/70 truncate">
                Trợ lý học tập 24/7
              </p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              aria-label="Xóa lịch sử"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <TrashIcon />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#F7F7FB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                    N
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#5153DF] text-white rounded-tr-sm"
                        : "bg-white text-[#1A1A2E] rounded-tl-sm border border-[#EAEAF4] shadow-sm"
                    }`}
                  >
                    {formatContent(msg.content)}
                  </div>
                  <span className="text-[10px] text-[#A0A0C0] px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  N
                </div>
                <div className="bg-white border border-[#EAEAF4] shadow-sm px-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 px-3 pt-2 pb-1 bg-white border-t border-[#F0F0F8] shrink-0 overflow-x-auto scrollbar-none">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => sendMessage(action.prompt)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#F0F0FF] text-[#4648D4] font-medium hover:bg-[#E0E0FF] transition-colors whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-[#F6F6FB] border border-[#EAEAF4] rounded-xl px-3 py-2 focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/10 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi cho Nova..."
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-[#1A1A2E] placeholder-[#B0B0C8] resize-none outline-none max-h-[80px] leading-relaxed"
                style={{ minHeight: "20px" }}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                aria-label="Gửi tin nhắn"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#6B6BFF] text-white hover:bg-[#5153DF] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Đóng Nova AI" : "Mở Nova AI Co-Pilot"}
        className="fixed bottom-5 right-5 z-50 w-13 h-13 rounded-2xl bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] text-white shadow-[0_4px_20px_rgba(107,107,255,0.45)] hover:shadow-[0_6px_28px_rgba(107,107,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/30"
        style={{ width: 52, height: 52 }}
      >
        {isOpen ? <XIcon /> : <SparklesIcon />}
        {/* Unread dot when closed */}
        {!isOpen && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#34D399] border-2 border-white animate-pulse" />
        )}
      </button>
    </>
  );
}
=======
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { sendAiChatMessage } from "@/src/features/student/ai-study-plan/services/ai-chat.client-service";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  animate?: boolean;
}

function renderFormattedText(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, lineIndex, lines) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let match;
    let lastIdx = 0;
    let idx = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={`text-${idx++}`}>{line.slice(lastIdx, match.index)}</span>);
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`bold-${idx++}`} className="font-semibold text-[#5052EE] bg-[#EEF2FF]/70 px-1.5 py-0.5 rounded-md border border-[#5052EE]/15">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <span key={`italic-${idx++}`} className="font-medium text-[#0D9488] bg-[#EAF8F5]/80 px-1.5 py-0.5 rounded-md border border-[#0D9488]/15">
            {token.slice(1, -1)}
          </span>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code key={`code-${idx++}`} className="font-mono text-xs text-[#D97706] bg-[#FFF8EB] px-1.5 py-0.5 rounded-md border border-[#D97706]/20">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(<span key={`other-${idx++}`}>{token}</span>);
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < line.length) {
      parts.push(<span key={`end-${idx++}`}>{line.slice(lastIdx)}</span>);
    }

    return (
      <React.Fragment key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function TypewriterText({
  id,
  text,
  animate = false,
  isStopped = false,
  onScroll,
  onTypingStateChange,
}: {
  id?: string;
  text: string;
  animate?: boolean;
  isStopped?: boolean;
  onScroll?: (smooth?: boolean) => void;
  onTypingStateChange?: (typing: boolean) => void;
}) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);
  const onScrollRef = useRef(onScroll);
  const isStoppedRef = useRef(isStopped);
  const onTypingRef = useRef(onTypingStateChange);

  useEffect(() => {
    onScrollRef.current = onScroll;
    isStoppedRef.current = isStopped;
    onTypingRef.current = onTypingStateChange;
  }, [onScroll, isStopped, onTypingStateChange]);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      onTypingRef.current?.(false);
      return;
    }

    onTypingRef.current?.(true);

    let currentIndex = 0;
    const totalLen = text.length;
    let tickCount = 0;

    const timer = setInterval(() => {
      if (isStoppedRef.current) {
        clearInterval(timer);
        setDisplayedText((prev) => prev + " ⏸️ *(Đã bị tạm dừng)*");
        onTypingRef.current?.(false);
        return;
      }

      if (currentIndex < totalLen) {
        // Stream small chunks of characters every 25ms
        const step = Math.floor(Math.random() * 4) + 2;
        currentIndex = Math.min(totalLen, currentIndex + step);
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        clearInterval(timer);
        onTypingRef.current?.(false);
        if (onScrollRef.current) {
          setTimeout(() => onScrollRef.current?.(false), 60);
        }
      }
    }, 25);

    return () => {
      clearInterval(timer);
      onTypingRef.current?.(false);
    };
  }, [text, animate]);

  return <>{renderFormattedText(displayedText)}</>;
}

export function FloatingAiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpenState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    if (typeof window !== "undefined") {
      localStorage.setItem("mindnova_floating_ai_chat_open_v1", String(open));
    }
  };

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Chào bạn! 👋 Mình là **Nova**, gia sư AI đồng hành cùng bạn 24/7. Bạn có câu hỏi hay bài tập nào cần mình hướng dẫn hôm nay không?",
      time: "Vừa xong",
    },
  ]);

  // Load chat history after hydration completes to guarantee 100% SSR matching
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("mindnova_floating_ai_chat_history_v1");
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m) => ({ ...m, animate: false })));
        }
      }
      const storedOpen = localStorage.getItem("mindnova_floating_ai_chat_open_v1");
      if (storedOpen === "true") {
        setIsOpenState(true);
      }
    } catch (e) {
      console.error("Failed to read floating chat history:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save chat history to localStorage ONLY after initial hydration load has finished
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      const toSave = messages.map((m) => ({ ...m, animate: false }));
      localStorage.setItem("mindnova_floating_ai_chat_history_v1", JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save floating chat history:", e);
    }
  }, [messages, isLoaded]);

  // Drag and Drop Positioning State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [stoppedMsgIds, setStoppedMsgIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth: boolean = false) => {
    // Direct container scrollTop assignment prevents browser window layout jumps or stuttering during typewriter animation
    if (chatBoxRef.current) {
      if (smooth) {
        chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
      } else {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    }
  };

  // Initialize initial coordinate position on client mount
  useEffect(() => {
    if (typeof window !== "undefined" && !position) {
      // Default to bottom-right corner with safe padding
      const defaultWidth = 340; // Updated 5% larger width
      const defaultHeight = 445; // Updated 5% larger height
      const initX = Math.max(16, window.innerWidth - defaultWidth - 24);
      const initY = Math.max(16, window.innerHeight - defaultHeight - 24);
      setPosition({ x: initX, y: initY });
    }
  }, []);

  // Handle Mouse Drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag if clicked on a button or input field inside header
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      return;
    }
    if (e.button !== 0) return; // Only trigger on left click

    isDraggingRef.current = true;
    setIsDragging(true);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Handle Touch Drag events for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      return;
    }
    const touch = e.touches[0];
    if (!touch) return;

    isDraggingRef.current = true;
    setIsDragging(true);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  // Global window listeners for continuous movement and mouse release
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      e.preventDefault();

      let newX = e.clientX - dragOffsetRef.current.x;
      let newY = e.clientY - dragOffsetRef.current.y;

      // Ensure window never moves off screen (viewport clipping boundary)
      const rect = containerRef.current.getBoundingClientRect();
      const maxRight = window.innerWidth - rect.width - 8;
      const maxBottom = window.innerHeight - rect.height - 8;

      newX = Math.max(8, Math.min(newX, maxRight));
      newY = Math.max(8, Math.min(newY, maxBottom));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;

      let newX = touch.clientX - dragOffsetRef.current.x;
      let newY = touch.clientY - dragOffsetRef.current.y;

      const rect = containerRef.current.getBoundingClientRect();
      const maxRight = window.innerWidth - rect.width - 8;
      const maxBottom = window.innerHeight - rect.height - 8;

      newX = Math.max(8, Math.min(newX, maxRight));
      newY = Math.max(8, Math.min(newY, maxBottom));

      setPosition({ x: newX, y: newY });
    };

    const handleEndDrag = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEndDrag);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleEndDrag);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleEndDrag);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleEndDrag);
      }
    };
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const history = messages.slice(-4).map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.time,
      }));
      return sendAiChatMessage(queryText, history);
    },
    onSuccess: (newAiMessage) => {
      const aiReply: Message = {
        id: newAiMessage.id || `ai-${Date.now()}`,
        sender: "ai",
        text: newAiMessage.text || "Mình đã nhận thông tin và sẵn sàng hỗ trợ tiếp lộ trình của bạn!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        animate: true,
      };
      setMessages((prev) => [...prev, aiReply]);
    },
    onError: (error) => {
      console.error("[FloatingAiChat] Failed to reach AI backend:", error);
      const friendlyText = error instanceof Error && (error.message.includes("Gia sư") || error.message.includes("⏳"))
        ? error.message
        : "⏳ **Gia sư Nova hiện đang bận xíu hoặc hệ thống đang chịu tải cao, bạn vui lòng chờ khoảng 1 phút rồi quay lại trò chuyện với mình nhé!** 😊";
      const fallbackReply: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: friendlyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        animate: true,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    },
  });

  const isGenerating = chatMutation.isPending || isTyping;

  const handleStop = () => {
    if (chatMutation.isPending) {
      chatMutation.reset();
      const stoppedReply: Message = {
        id: `stop-${Date.now()}`,
        sender: "ai",
        text: "⏸️ *(Bạn đã tạm dừng Gia sư Nova trước khi câu trả lời được hoàn thành)*",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        animate: false,
      };
      setMessages((prev) => [...prev, stoppedReply]);
      setIsTyping(false);
    } else if (isTyping) {
      const latestAiMsg = [...messages].reverse().find((m) => m.sender === "ai");
      if (latestAiMsg) {
        setStoppedMsgIds((prev) => [...prev, latestAiMsg.id]);
      }
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
    }
  }, [messages, isOpen, chatMutation.isPending]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isGenerating) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    
    chatMutation.mutate(query);
  };

  // Listen to programmatic open triggers from anywhere in the app (e.g. course sidebar AI cards)
  useEffect(() => {
    const handleOpenAiChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ initialQuery?: string; autoSend?: boolean }>;
      setIsOpen(true);
      if (customEvent.detail?.initialQuery) {
        const query = customEvent.detail.initialQuery;
        if (customEvent.detail.autoSend && !chatMutation.isPending) {
          const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: query,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, userMsg]);
          chatMutation.mutate(query);
        } else {
          setInput(query);
        }
      }
    };
    window.addEventListener("open-ai-tutor-chat", handleOpenAiChat);
    return () => window.removeEventListener("open-ai-tutor-chat", handleOpenAiChat);
  }, [chatMutation]);

  const quickSuggestions = [
    "💡 Tổng hợp tiến độ",
    "🎯 Kiểm tra kiến thức",
    "📖 Gợi ý bài học tiếp",
  ];

  if (pathname === "/study-plan" || pathname?.startsWith("/study-plan/")) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[99999] pointer-events-auto transition-shadow duration-300"
      style={
        position
          ? { left: `${position.x}px`, top: `${position.y}px` }
          : { bottom: "20px", right: "20px" }
      }
    >
      {/* Collapsed Button State with Draggable Grip Handle */}
      {!isOpen && (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#5052EE] via-[#6063EE] to-[#4CD7F6] text-white font-bold shadow-[0_6px_24px_rgba(80,82,238,0.35)] hover:shadow-[0_8px_32px_rgba(80,82,238,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border border-white/25 cursor-move select-none"
          title="Nhấn và kéo để di chuyển vị trí, hoặc bấm nút để mở cửa sổ chat"
        >
          {/* Subtle drag handle grip dots */}
          <span className="text-white/70 text-xs tracking-tighter -ml-1 pr-0.5 font-normal">⋮⋮</span>

          <div className="relative flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
            <svg
              className="w-3.5 h-3.5 transform group-hover:rotate-12 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981] border border-white" />
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold tracking-normal drop-shadow-2xs pr-1 bg-transparent border-none text-white focus:outline-none cursor-pointer"
          >
            💬 Hỏi Gia sư AI
          </button>
        </div>
      )}

      {/* Expanded Floating Modal Window - 5% Larger Dimensions (340px x 445px) with Draggable Header */}
      <div
        className={`w-[calc(100vw-2rem)] sm:w-[340px] h-[445px] max-h-[80vh] bg-white rounded-2xl shadow-[0_16px_48px_rgba(26,26,46,0.22)] border border-[#E4E6F0] flex-col overflow-hidden transition-transform duration-250 animate-in fade-in zoom-in-95 origin-bottom-right ${
          isDragging ? "ring-2 ring-[#5052EE]/50 shadow-2xl scale-[1.01]" : ""
        } ${isOpen ? "flex" : "hidden"}`}
      >
          {/* Interactive Draggable Header */}
          <header
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="px-4 py-3 border-b border-[#E8E9F2] bg-gradient-to-r from-[#F8F9FD] via-[#F5F7FD] to-[#EEF2FF] flex items-center justify-between shrink-0 cursor-move select-none group/header hover:bg-[#EEF2FF]/60 transition-colors"
            title="Nhấn và kéo thanh tiêu đề để chuyển vị trí cửa sổ trên màn hình"
          >
            <div className="flex items-center gap-2.5">
              {/* Grip icon indicating dragging capability */}
              <span className="text-[#A0A0C0] group-hover/header:text-[#5052EE] text-xs font-bold tracking-tighter transition-colors">
                ⋮⋮
              </span>
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#5052EE] via-[#6063EE] to-[#4CD7F6] text-white flex items-center justify-center shadow-2xs text-xs font-bold">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#1A1A2E] tracking-tight">
                    Nova AI Co-Pilot
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="Online" />
                </div>
                <p className="text-[10px] font-medium text-[#7878A0]">Trợ lý học tập 24/7 • <span className="italic text-[#5052EE]/80">Kéo để di chuyển</span></p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện và tạo hội thoại mới không?")) {
                    const defaultMsg: Message = {
                      id: `init-${Date.now()}`,
                      sender: "ai",
                      text: "Chào bạn! 👋 Mình là **Nova**, gia sư AI đồng hành cùng bạn 24/7. Bạn có câu hỏi hay bài tập nào cần mình hướng dẫn hôm nay không?",
                      time: "Vừa xong",
                    };
                    setMessages([defaultMsg]);
                    localStorage.setItem("mindnova_floating_ai_chat_history_v1", JSON.stringify([defaultMsg]));
                  }
                }}
                aria-label="Xóa lịch sử chat"
                title="Xóa và làm mới cuộc trò chuyện"
                className="w-7 h-7 rounded-lg hover:bg-[#FEE2E2] text-[#64647A] hover:text-[#DC2626] flex items-center justify-center transition-colors focus:outline-none cursor-pointer text-xs font-normal"
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Thu nhỏ"
                title="Thu nhỏ cửa sổ"
                className="w-7 h-7 rounded-lg hover:bg-[#E0E5FF] text-[#64647A] hover:text-[#5052EE] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Chat Messages Area */}
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 bg-[#FCFDFE]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                {msg.sender === "ai" ? (
                  <div className="w-6.5 h-6.5 rounded-lg bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs border border-[#5052EE]/20">
                    N
                  </div>
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full overflow-hidden shrink-0 mt-0.5 border border-[#EAEAF4] shadow-2xs">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                      width={26}
                      height={26}
                      sizes="26px"
                      alt="You"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : ""}`}>
                  <div
                    className={`p-3 rounded-xl text-[12.5px] leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#5052EE] via-[#5C5EF0] to-[#686AF4] text-white rounded-tr-none shadow-2xs font-medium"
                        : "bg-[#F4F6FC] text-[#1A1A2E] border border-[#E4E6F0] rounded-tl-none font-normal"
                    }`}
                  >
                    {msg.sender === "ai" ? (
                      msg.animate ? (
                        <TypewriterText
                          id={msg.id}
                          text={msg.text}
                          animate={msg.animate}
                          isStopped={stoppedMsgIds.includes(msg.id)}
                          onScroll={scrollToBottom}
                          onTypingStateChange={setIsTyping}
                        />
                      ) : (
                        renderFormattedText(msg.text)
                      )
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[10px] font-normal text-[#9898A8] px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {chatMutation.isPending && (
              <div className="flex items-start gap-2.5 max-w-[80%]">
                <div className="w-6.5 h-6.5 rounded-lg bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs border border-[#5052EE]/20 animate-pulse">
                  N
                </div>
                <div className="bg-[#F4F6FC] border border-[#E4E6F0] px-3.5 py-2.5 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-2xs">
                  <span className="text-xs font-semibold text-[#5052EE] mr-1">Nova đang nghĩ...</span>
                  <div className="w-1.5 h-1.5 bg-[#5052EE] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#5052EE] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#5052EE] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Localized Quick Prompt Chips */}
          <div className="px-3.5 py-2 border-t border-[#F0F2FA] bg-white flex items-center gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item)}
                disabled={isGenerating}
                className="shrink-0 text-xs font-semibold bg-[#F8FAFC] hover:bg-[#EEF2FF] disabled:opacity-50 text-[#64647A] hover:text-[#5052EE] border border-[#EAEAF4] hover:border-[#5052EE]/30 rounded-xl px-3 py-1.5 transition-all duration-200 focus:outline-none cursor-pointer shadow-2xs"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Footer Input Bar */}
          <div className="p-2.5 bg-white border-t border-[#E8E9F2] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isGenerating) handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating}
                placeholder={isGenerating ? "Nova đang trả lời..." : "Nhập câu hỏi cho Nova..."}
                className="flex-1 bg-[#F8FAFC] focus:bg-white disabled:bg-gray-100 border border-[#EAEAF4] focus:border-[#5052EE] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#1A1A2E] placeholder:text-[#9496A8] focus:outline-none focus:ring-2 focus:ring-[#5052EE]/25 transition-all duration-200"
              />
              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Tạm dừng AI trả lời"
                  title="Dừng câu trả lời của AI"
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#EA580C] hover:opacity-95 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-[0_4px_12px_rgba(225,29,72,0.35)] animate-pulse active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="5" y="4" width="5" height="16" rx="1.5" />
                    <rect x="14" y="4" width="5" height="16" rx="1.5" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Gửi tin nhắn"
                  disabled={!input.trim()}
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 disabled:opacity-50 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-sm active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              )}
            </form>
          </div>

        </div>
    </div>
  );
}

export default FloatingAiChat;
>>>>>>> origin/main
