"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon, MoreVerticalIcon, RobotIcon, SendIcon } from "./icons";
import type { AiChatMessage } from "../types";
import { sendAiChatMessage } from "../services/ai-chat.client-service";

interface ChatPanelProps {
  initialMessages?: AiChatMessage[];
  syllabusTitle?: string;
  lessonId?: number;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
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
        tickCount++;
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

export function ChatPanel({
  initialMessages = [
    {
      id: "msg-init",
      sender: "ai",
      timestamp: "Vừa xong",
      text: "Chào bạn! 👋 Mình là **Nova**, trợ lý AI Co-Pilot đồng hành cùng bạn tại MindNova AI. Hiện tại chúng ta đang học **Module 4: Quantum Computing Fundamentals**.\n\nBạn đã thành thạo khái niệm *Superposition* (Chồng chập lượng tử)! Hôm nay bạn muốn tìm hiểu sâu hơn về toán học của **Quantum Entanglement** (Vướng víu lượng tử) hay muốn chạy thử nghiệm mô phỏng mạch **Qubit Gates**?",
    },
  ],
  syllabusTitle = "Quantum Computing Fundamentals",
  lessonId,
  externalPrompt,
  onClearExternalPrompt,
}: ChatPanelProps) {
  const storageKey = `mindnova_study_plan_chat_v1_${lessonId || "general"}`;
  const [messages, setMessages] = useState<AiChatMessage[]>(initialMessages);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stoppedMsgIds, setStoppedMsgIds] = useState<string[]>([]);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history after hydration completes to guarantee 100% SSR matching
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: AiChatMessage[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m) => ({ ...m, animate: false })));
        }
      }
    } catch (e) {
      console.error("Failed to read study plan chat history:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save chat history ONLY after initial hydration load has finished
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      const toSave = messages.map((m) => ({ ...m, animate: false }));
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save study plan chat history:", e);
    }
  }, [messages, storageKey, isLoaded]);

  const quickPrompts = [
    { id: 1, text: "Giải thích khái niệm quan trọng bằng ví dụ thực tế trong cuộc sống", query: "Hãy giải thích cho tôi các khái niệm quan trọng bằng một ví dụ thực tế trong cuộc sống cho dễ hiểu nhé", tag: "Ví dụ trực quan", color: "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/20" },
    { id: 2, text: "Tạo 3 câu hỏi trắc nghiệm ôn tập kiến thức kèm giải thích chi tiết", query: "Hãy giúp tôi tạo 3 câu hỏi ôn tập kèm theo giải thích đáp án chi tiết nhé", tag: "Ôn tập nhanh", color: "bg-[#EAF8F5] text-[#0D9488] border-[#0D9488]/20" },
    { id: 3, text: "Tóm tắt ngắn gọn những ý cốt lõi quan trọng nhất của bài học này", query: "Hãy tóm tắt ngắn gọn những ý quan trọng nhất của bài học này giúp mình với", tag: "Tóm tắt bài", color: "bg-[#FFF8EB] text-[#D97706] border-[#D97706]/20" },
  ];

  const scrollToBottom = (smooth: boolean = false) => {
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

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (messageText: string) => sendAiChatMessage(messageText, messages, lessonId),
    onSuccess: (newAiMessage) => {
      setMessages((prev) => [...prev, { ...newAiMessage, animate: true }]);
    },
    onError: (error) => {
      console.error("[ChatPanel] AI Tutor response failed:", error);
      const friendlyText = error instanceof Error && (error.message.includes("Gia sư") || error.message.includes("⏳"))
        ? error.message
        : "⏳ **Gia sư Nova hiện đang bận xíu hoặc hệ thống đang chịu tải cao, bạn vui lòng chờ khoảng 1 phút rồi quay lại trò chuyện với mình nhé!** 😊";
      const errorMessage: AiChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: friendlyText,
        animate: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const isGenerating = chatMutation.isPending || isTyping;

  const handleStop = () => {
    if (chatMutation.isPending) {
      chatMutation.reset();
      const stoppedReply: AiChatMessage = {
        id: `stop-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "⏸️ *(Bạn đã tạm dừng Gia sư Nova trước khi câu trả lời được hoàn thành)*",
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

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isGenerating) return;

    const newUserMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: text,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!textToSend) {
      setInputText("");
    }

    chatMutation.mutate(text);
  };

  useEffect(() => {
    if (externalPrompt && !isGenerating) {
      handleSend(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt, isGenerating]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2500);
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-[700px] h-[calc(100vh-7.5rem)] bg-white rounded-2xl border border-[#F0F0F8] shadow-sm relative overflow-hidden transition-all duration-200">
      
      {/* ─── Synchronized Chat Header ─── */}
      <header className="shrink-0 bg-white border-b border-[#F0F0F8] flex flex-wrap items-center justify-between px-6 py-4 gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
            <RobotIcon className="w-5.5 h-5.5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981] border-2 border-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-[#1A1A2E]">
                Nova Neural AI Co-Pilot
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#0D9488] font-semibold bg-[#D1FAE5]/70 px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Active Engine
              </span>
            </div>
            <p className="text-xs font-medium text-[#64647A]">Đang theo dõi bài học: {syllabusTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này để tạo hội thoại mới không?")) {
                setMessages(initialMessages);
                localStorage.setItem(storageKey, JSON.stringify(initialMessages));
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF5F5] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-xs font-semibold transition-colors cursor-pointer"
            title="Xóa và làm mới cuộc trò chuyện"
          >
            <span>🗑️</span>
            <span>Xóa lịch sử</span>
          </button>
          <div className="flex items-center gap-2 bg-[#F8F9FE] px-3.5 py-1.5 rounded-xl border border-[#E2E4F0] text-xs font-semibold text-[#6B6BFF]">
            <span>🛡️</span>
            <span>Gemini + OpenAI Neural Hub Ready</span>
          </div>
        </div>
      </header>

      {/* ─── Messages Stream with Ambient Holographic Backdrop ─── */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 bg-gradient-to-b from-[#F9FAFF] via-[#FAFBFE] to-[#F2F5FD]">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          const isPinned = pinnedIds.includes(msg.id);
          const isCopied = copiedMsgId === msg.id;

          return isAi ? (
            /* Nova AI Message with Micro-actions */
            <div key={msg.id} className="flex items-start gap-4 max-w-[92%] sm:max-w-[85%] group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] via-[#5A5DF2] to-[#4CD7F6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-[0_6px_16px_rgba(107,107,255,0.35)] text-xs font-bold transform group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                <RobotIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-between ml-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-[#5052EE]">Nova AI Co-Pilot</span>
                    <span className="text-[11px] font-normal text-[#8888A8]">{msg.timestamp}</span>
                    {isPinned && <span className="text-[11px] font-medium bg-[#FFF8EB] text-[#D97706] px-2.5 py-0.5 rounded-full border border-[#D97706]/20">★ Đã lưu chú thích</span>}
                  </div>
                </div>
                <div className="bg-white text-[#2B2C40] px-6 py-5 rounded-2xl rounded-tl-sm border border-[#E8EAEF] border-l-4 border-l-[#6B6BFF] shadow-sm text-sm sm:text-[14.5px] leading-relaxed font-normal transition-all">
                  {msg.animate ? (
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
                  )}
                </div>
                
                {/* Micro-Interaction Action Button Bar */}
                <div className="flex items-center flex-wrap gap-2 ml-1 mt-0.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium text-[#64647A] hover:text-[#5052EE] bg-[#F8F9FE] hover:bg-[#EEF2FF] border border-[#E2E4F0] transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{isCopied ? "✓" : "📋"}</span>
                    <span>{isCopied ? "Đã chép!" : "Sao chép"}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => togglePin(msg.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer shadow-2xs border ${
                      isPinned
                        ? "bg-[#FFF8EB] text-[#D97706] border-[#D97706]/30"
                        : "text-[#64647A] hover:text-[#D97706] bg-[#F8F9FE] hover:bg-[#FFF8EB] border-[#E2E4F0]"
                    }`}
                  >
                    <span>★</span>
                    <span>{isPinned ? "Đã lưu" : "Lưu chú thích"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSend("Hãy giải thích lại ý trên một cách đơn giản, dễ hiểu hơn kèm ví dụ thực tế nhé!")}
                    disabled={chatMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium text-[#0D9488] hover:text-[#097268] bg-[#EAF8F5] hover:bg-[#D3F3EC] border border-[#0D9488]/25 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <span>💡</span>
                    <span>Giải thích dễ hiểu hơn</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* User Message */
            <div key={msg.id} className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] self-end flex-row-reverse group">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 border border-[#E2E4F0] shadow-2xs">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                  width={36}
                  height={36}
                  sizes="36px"
                  alt="You"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-1 items-end flex-1 min-w-0">
                <div className="flex items-center gap-2 mr-1">
                  <span className="text-[11px] font-normal text-[#8888A8]">{msg.timestamp}</span>
                  <span className="text-xs font-semibold text-[#3A3B50]">Bạn</span>
                </div>
                <div className="bg-gradient-to-r from-[#5052EE] to-[#6669F6] text-white px-4.5 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm font-normal whitespace-pre-line border border-white/15">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Nova Live Neural Synthesizer Typing Indicator */}
        {chatMutation.isPending && (
          <div className="flex items-start gap-3.5 max-w-[80%]">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm animate-pulse">
              <RobotIcon className="w-5 h-5" />
            </div>
            <div className="bg-white border border-[#E2E4F0] px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-2 w-fit">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-xs font-semibold text-[#5052EE]">Nova đang tổng hợp câu trả lời cho bạn...</span>
              </div>
              <div className="flex items-center gap-1.5 pl-1">
                <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-[#4CD7F6] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-[11px] font-normal text-[#808298] pl-2">Đang xử lý biểu diễn logic và kiến thức bài giảng</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* ─── Interactive Quick-Prompts ─── */}
        <div className="mt-6 pt-5 border-t border-[#E8EAEF] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#545574] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6B6BFF]" />
              <span>Gợi ý câu hỏi tương tác nhanh</span>
            </span>
            <span className="text-[11px] font-medium text-[#0D9488] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">⚡ Nhấp để hỏi ngay</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSend(prompt.query)}
                disabled={isGenerating}
                className="group relative text-left p-3.5 rounded-xl bg-white hover:bg-[#F8F9FE] disabled:opacity-50 border border-[#E2E4F0] hover:border-[#6B6BFF]/50 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 focus:outline-none cursor-pointer flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-lg border ${prompt.color}`}>
                    {prompt.tag}
                  </span>
                  <span className="w-5 h-5 rounded-md bg-[#F4F5FB] group-hover:bg-[#6B6BFF] group-hover:text-white text-[#8888A8] flex items-center justify-center text-xs font-bold transition-all">
                    ↗
                  </span>
                </div>
                <p className="text-xs font-normal text-[#3C3D5A] group-hover:text-[#5052EE] leading-relaxed transition-colors">
                  {prompt.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Elevated Compact Input Bar ─── */}
      <div className="px-5 py-3 bg-white border-t border-[#F0F0F8] shrink-0">
        <div className="max-w-5xl mx-auto space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isGenerating}
                placeholder={isGenerating ? "Nova đang tổng hợp câu trả lời cho bạn..." : "Hỏi Nova bất cứ điều gì về bài tập hay lộ trình học bối rối nhé..."}
                className="w-full bg-[#F8F9FE] focus:bg-white disabled:bg-gray-100 border border-[#E2E4F0] focus:border-[#6B6BFF] rounded-xl pl-4 pr-24 py-2.5 text-xs sm:text-sm text-[#1A1A2E] placeholder:text-[#9092A8] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-200 font-medium"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#9496A8] hidden sm:block">
                <span>Enter ↵</span>
              </div>
            </div>
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Tạm dừng câu trả lời"
                className="shrink-0 px-5 py-2.5 flex items-center justify-center bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#EA580C] hover:brightness-110 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none shadow-[0_4px_16px_rgba(225,29,72,0.35)] animate-pulse active:scale-95 cursor-pointer gap-2"
              >
                <span>Tạm dừng</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="5" height="16" rx="1.5" />
                  <rect x="14" y="4" width="5" height="16" rx="1.5" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="shrink-0 px-5 py-2.5 flex items-center justify-center bg-gradient-to-r from-[#5052EE] via-[#6669F6] to-[#4CD7F6] hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <span>Gửi tin</span>
                <SendIcon className="w-4 h-4 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-center text-xs font-normal text-[#64647A] pt-1">
            <span>💡 <strong>Mẹo nhỏ:</strong> Bạn có thể dán công thức toán học, bài toán khó hoặc xin code ví dụ bằng Python/JavaScript trực tiếp.</span>
          </div>
        </div>
      </div>
    </div>
  );
}