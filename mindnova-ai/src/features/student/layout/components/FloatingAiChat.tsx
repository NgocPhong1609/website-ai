"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Sparkles, Trash2, Lightbulb, Target, BookOpen } from "lucide-react";
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
          <strong key={`bold-${idx++}`} className="font-semibold text-[#A93226] bg-[#EEF2FF]/70 px-1.5 py-0.5 rounded-md border border-[#A93226]/15">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <span key={`italic-${idx++}`} className="font-medium text-[#27AE60] bg-[#EAF8F5]/80 px-1.5 py-0.5 rounded-md border border-[#27AE60]/15">
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
    { label: "Tổng hợp tiến độ", icon: <Lightbulb size={12} className="mr-1.5" /> },
    { label: "Kiểm tra kiến thức", icon: <Target size={12} className="mr-1.5" /> },
    { label: "Gợi ý bài học tiếp", icon: <BookOpen size={12} className="mr-1.5" /> },
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
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#C0392B] via-[#A93226] to-[#C0392B] text-white font-bold shadow-[0_6px_24px_rgba(192,57,43,0.35)] hover:shadow-[0_8px_32px_rgba(192,57,43,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border border-white/25 cursor-move select-none"
          title="Nhấn và kéo để di chuyển vị trí, hoặc bấm nút để mở cửa sổ chat"
        >
          {/* Subtle drag handle grip dots */}
          <span className="text-white/70 text-xs tracking-tighter -ml-1 pr-0.5 font-normal">⋮⋮</span>

          <div className="relative flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27AE60] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27AE60] border border-white" />
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center text-xs font-bold tracking-normal drop-shadow-2xs pr-1 bg-transparent border-none text-white focus:outline-none cursor-pointer"
          >
            <MessageCircle size={14} className="mr-1.5" /> Hỏi Gia sư AI
          </button>
        </div>
      )}

      {/* Expanded Floating Modal Window - 5% Larger Dimensions (340px x 445px) with Draggable Header */}
      <div
        className={`w-[calc(100vw-2rem)] sm:w-[340px] h-[445px] max-h-[80vh] bg-white rounded-2xl shadow-[0_16px_48px_rgba(26,26,46,0.22)] border border-[#E4E6F0] flex-col overflow-hidden transition-transform duration-250 animate-in fade-in zoom-in-95 origin-bottom-right ${
          isDragging ? "ring-2 ring-[#A93226]/50 shadow-2xl scale-[1.01]" : ""
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
              <span className="text-[#A0A0C0] group-hover/header:text-[#A93226] text-xs font-bold tracking-tighter transition-colors">
                ⋮⋮
              </span>
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#C0392B] via-[#A93226] to-[#C0392B] text-white flex items-center justify-center shadow-2xs text-xs font-bold">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#1A1A2E] tracking-tight">
                    Nova AI Co-Pilot
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" title="Online" />
                </div>
                <p className="text-[10px] font-medium text-[#7878A0]">Trợ lý học tập 24/7 • <span className="italic text-[#A93226]/80">Kéo để di chuyển</span></p>
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
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Thu nhỏ"
                title="Thu nhỏ cửa sổ"
                className="w-7 h-7 rounded-lg hover:bg-[#E0E5FF] text-[#64647A] hover:text-[#A93226] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                  <div className="w-6.5 h-6.5 rounded-lg bg-[#EEF2FF] text-[#A93226] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs border border-[#A93226]/20">
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
                        ? "bg-gradient-to-r from-[#A93226] via-[#5C5EF0] to-[#686AF4] text-white rounded-tr-none shadow-2xs font-medium"
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
                <div className="w-6.5 h-6.5 rounded-lg bg-[#EEF2FF] text-[#A93226] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs border border-[#A93226]/20 animate-pulse">
                  N
                </div>
                <div className="bg-[#F4F6FC] border border-[#E4E6F0] px-3.5 py-2.5 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-2xs">
                  <span className="text-xs font-semibold text-[#A93226] mr-1">Nova đang nghĩ...</span>
                  <div className="w-1.5 h-1.5 bg-[#A93226] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#A93226] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#A93226] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                onClick={() => handleSend(item.label)}
                disabled={isGenerating}
                className="shrink-0 flex items-center justify-center text-xs font-semibold bg-[#F8FAFC] hover:bg-[#EEF2FF] disabled:opacity-50 text-[#64647A] hover:text-[#A93226] border border-[#EAEAF4] hover:border-[#A93226]/30 rounded-xl px-3 py-1.5 transition-all duration-200 focus:outline-none cursor-pointer shadow-2xs"
              >
                {item.icon} {item.label}
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
                className="flex-1 bg-[#F8FAFC] focus:bg-white disabled:bg-gray-100 border border-[#EAEAF4] focus:border-[#A93226] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#1A1A2E] placeholder:text-[#9496A8] focus:outline-none focus:ring-2 focus:ring-[#A93226]/25 transition-all duration-200"
              />
              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Tạm dừng AI trả lời"
                  title="Dừng câu trả lời của AI"
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#EA580C] hover:opacity-95 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-[0_4px_12px_rgba(225,29,72,0.35)] animate-pulse active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Gửi tin nhắn"
                  disabled={!input.trim()}
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#C0392B] via-[#A93226] to-[#C0392B] hover:opacity-95 disabled:opacity-50 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-sm active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
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
