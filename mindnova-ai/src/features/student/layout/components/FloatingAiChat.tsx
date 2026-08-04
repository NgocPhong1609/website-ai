"use client";

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
  text,
  animate = false,
  onScroll,
}: {
  text: string;
  animate?: boolean;
  onScroll?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }

    let currentIndex = 0;
    const totalLen = text.length;
    let tickCount = 0;

    const timer = setInterval(() => {
      if (currentIndex < totalLen) {
        // Stream small chunks of characters every 25ms to mimic real-time LLM speed
        const step = Math.floor(Math.random() * 4) + 2;
        currentIndex = Math.min(totalLen, currentIndex + step);
        setDisplayedText(text.slice(0, currentIndex));
        tickCount++;
        if (tickCount % 5 === 0 && onScrollRef.current) {
          onScrollRef.current();
        }
      } else {
        clearInterval(timer);
        if (onScrollRef.current) {
          setTimeout(() => onScrollRef.current?.(), 60);
        }
      }
    }, 25);

    return () => clearInterval(timer);
  }, [text, animate]);

  return <>{renderFormattedText(displayedText)}</>;
}

export function FloatingAiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Chào bạn! 👋 Mình là **Nova**, gia sư AI đồng hành cùng bạn 24/7. Bạn có câu hỏi hay bài tập nào cần mình hướng dẫn hôm nay không?",
      time: "Vừa xong",
    },
  ]);

  // Drag and Drop Positioning State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, chatMutation.isPending]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || chatMutation.isPending) return;

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
      {isOpen && (
        <div
          className={`w-[calc(100vw-2rem)] sm:w-[340px] h-[445px] max-h-[80vh] bg-white rounded-2xl shadow-[0_16px_48px_rgba(26,26,46,0.22)] border border-[#E4E6F0] flex flex-col overflow-hidden transition-transform duration-250 animate-in fade-in zoom-in-95 origin-bottom-right ${
            isDragging ? "ring-2 ring-[#5052EE]/50 shadow-2xl scale-[1.01]" : ""
          }`}
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
          </header>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 bg-[#FCFDFE]">
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
                        <TypewriterText text={msg.text} animate={msg.animate} onScroll={scrollToBottom} />
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
                disabled={chatMutation.isPending}
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
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={chatMutation.isPending}
                placeholder="Nhập câu hỏi cho Nova..."
                className="flex-1 bg-[#F8FAFC] focus:bg-white disabled:bg-gray-100 border border-[#EAEAF4] focus:border-[#5052EE] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#1A1A2E] placeholder:text-[#9496A8] focus:outline-none focus:ring-2 focus:ring-[#5052EE]/25 transition-all duration-200"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || chatMutation.isPending}
                className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] hover:opacity-95 disabled:opacity-50 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-sm active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default FloatingAiChat;
