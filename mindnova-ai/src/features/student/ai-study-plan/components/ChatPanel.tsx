"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Star, Check, Clipboard, Zap, Send, Bot, CornerDownLeft, ArrowUpRight, CircleStop } from "lucide-react";
import toast from "react-hot-toast";
import type { AiChatMessage, AiQuotaMeta } from "../types";
import { AiQuotaError, sendAiChatMessage } from "../services/ai-chat.client-service";

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
          <strong key={`bold-${idx++}`} className="font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <span key={`italic-${idx++}`} className="font-medium text-foreground bg-secondary px-1.5 py-0.5 rounded-md border border-border">
            {token.slice(1, -1)}
          </span>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code key={`code-${idx++}`} className="font-mono text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md border border-border">
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
        setDisplayedText((prev) => prev + "  *(Đã bị tạm dừng)*");
        onTypingRef.current?.(false);
        return;
      }

      if (currentIndex < totalLen) {
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
  initialMessages = [],
  syllabusTitle = "Chủ đề học",
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [quota, setQuota] = useState<AiQuotaMeta | null>(null);
  const [quotaResetReached, setQuotaResetReached] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (quota?.remaining !== 0) return;
    const resetAt = Date.parse(quota.resets_at);
    if (!Number.isFinite(resetAt) || resetAt <= Date.now()) return;

    const timer = window.setTimeout(
      () => setQuotaResetReached(true),
      Math.min(resetAt - Date.now(), 2_147_483_647)
    );
    return () => window.clearTimeout(timer);
  }, [quota]);

  const resetAt = quota ? Date.parse(quota.resets_at) : Number.NaN;
  const isQuotaBlocked = quota?.remaining === 0
    && !quotaResetReached
    && (!Number.isFinite(resetAt) || resetAt > Date.now());

  const updateQuota = (nextQuota: AiQuotaMeta) => {
    setQuota(nextQuota);
    setQuotaResetReached(false);
  };

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
    { id: 1, text: "Giải thích khái niệm quan trọng bằng ví dụ thực tế trong cuộc sống", query: "Hãy giải thích cho tôi các khái niệm quan trọng bằng một ví dụ thực tế trong cuộc sống cho dễ hiểu nhé", tag: "Ví dụ trực quan", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { id: 2, text: "Tạo 3 câu hỏi trắc nghiệm ôn tập kiến thức kèm giải thích chi tiết", query: "Hãy giúp tôi tạo 3 câu hỏi ôn tập kèm theo giải thích đáp án chi tiết nhé", tag: "Ôn tập nhanh", color: "bg-slate-100 text-slate-700 border-slate-200" },
    { id: 3, text: "Tóm tắt ngắn gọn những ý cốt lõi quan trọng nhất của bài học này", query: "Hãy tóm tắt ngắn gọn những ý quan trọng nhất của bài học này giúp mình với", tag: "Tóm tắt bài", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
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
    onSuccess: (result) => {
      if (result.quota) updateQuota(result.quota);
      setMessages((prev) => [...prev, { ...result.message, animate: true }]);
    },
    onError: (error) => {
      console.error("[ChatPanel] AI Tutor response failed:", error);
      if (error instanceof AiQuotaError && error.quota) updateQuota(error.quota);
      const friendlyText = error instanceof Error && (error.message.includes("Gia sư") || error.message.includes(""))
        ? error.message
        : " **Gia sư Nova hiện đang bận xíu hoặc hệ thống đang chịu tải cao, bạn vui lòng chờ khoảng 1 phút rồi quay lại trò chuyện với mình nhé!** ";
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
        text: " *(Bạn đã tạm dừng Gia sư Nova trước khi câu trả lời được hoàn thành)*",
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
    if (!text || isGenerating || isQuotaBlocked) return;

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
    if (externalPrompt && !isGenerating && !isQuotaBlocked) {
      handleSend(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt, isGenerating, isQuotaBlocked]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && !isQuotaBlocked) handleSend();
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
    <div className="flex-1 flex flex-col w-full min-h-[700px] h-[calc(100vh-7.5rem)] bg-white rounded-2xl border border-border shadow-sm relative overflow-hidden transition-all duration-200">
      
      {/* ─── Synchronized Chat Header ─── */}
      <header className="shrink-0 bg-white border-b border-border flex flex-wrap items-center justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Nova Neural AI
              </h2>
            </div>
            <p className="text-xs font-medium text-muted-foreground">Hỗ trợ bài học: {syllabusTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(!showConfirmDelete)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-secondary border border-border text-muted-foreground text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              title="Xóa và làm mới cuộc trò chuyện"
            >
              Xóa lịch sử
            </button>
            {showConfirmDelete && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white border border-border shadow-xl rounded-xl z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <p className="text-sm font-medium text-foreground">Bạn có chắc chắn muốn xóa lịch sử trò chuyện này không?</p>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3 py-1.5 bg-secondary text-stone-700 hover:bg-stone-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      setMessages(initialMessages);
                      localStorage.setItem(storageKey, JSON.stringify(initialMessages));
                      setShowConfirmDelete(false);
                      toast.success("Đã xóa lịch sử trò chuyện");
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-200 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /><span>AI Ready</span>
          </div>
        </div>
      </header>

      {/* ─── Messages Stream ─── */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 bg-muted/50">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          const isPinned = pinnedIds.includes(msg.id);
          const isCopied = copiedMsgId === msg.id;

          return isAi ? (
            /* Nova AI Message */
            <div key={msg.id} className="flex items-start gap-4 max-w-[92%] sm:max-w-[85%] group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-between ml-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-stone-700">Nova AI</span>
                    <span className="text-[11px] font-normal text-stone-400">{msg.timestamp}</span>
                    {isPinned && <span className="text-[11px] font-medium bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full border border-border"><Star size={12} fill="currentColor" className="mr-1 inline" /> Đã lưu</span>}
                  </div>
                </div>
                <div className="bg-white text-foreground px-5 py-4 rounded-2xl rounded-tl-sm border border-border shadow-sm text-sm sm:text-[14.5px] leading-relaxed font-normal transition-all">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-blue-600 bg-white border border-border transition-all cursor-pointer shadow-sm"
                  >
                    <span>{isCopied ? <Check size={12} /> : <Clipboard size={12} />}</span>
                    <span>{isCopied ? "Đã chép!" : "Sao chép"}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => togglePin(msg.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer shadow-sm border ${
                      isPinned
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "text-slate-500 hover:text-blue-600 bg-white border-slate-200"
                    }`}
                  >
                    <span><Star size={12} fill={isPinned ? "currentColor" : "none"} /></span>
                    <span>{isPinned ? "Đã lưu" : "Lưu chú thích"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSend("Hãy giải thích lại ý trên một cách đơn giản, dễ hiểu hơn kèm ví dụ thực tế nhé!")}
                    disabled={chatMutation.isPending || isQuotaBlocked}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium text-[#0F172A] hover:text-[#097268] bg-[#F5F0E8] hover:bg-[#D3F3EC] border border-[#0F172A]/25 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <span>Giải thích dễ hiểu hơn</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* User Message */
            <div key={msg.id} className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] self-end flex-row-reverse group">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 border border-border shadow-sm">
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
                  <span className="text-[11px] font-normal text-stone-400">{msg.timestamp}</span>
                  <span className="text-xs font-semibold text-stone-700">Bạn</span>
                </div>
                <div className="bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm font-normal whitespace-pre-line border border-blue-700">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Nova Live Neural Synthesizer Typing Indicator */}
        {chatMutation.isPending && (
          <div className="flex items-start gap-3.5 max-w-[80%]">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-2 w-fit">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-success-bg0 animate-ping" />
                <span className="text-xs font-semibold text-muted-foreground">Nova đang tổng hợp câu trả lời...</span>
              </div>
              <div className="flex items-center gap-1.5 pl-1">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* ─── Interactive Quick-Prompts ─── */}
        <div className="mt-6 pt-5 border-t border-border flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Gợi ý câu hỏi</span>
            </span>
            <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border flex items-center">
              <Zap size={12} fill="currentColor" className="mr-1" /> Nhấp để hỏi ngay
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSend(prompt.query)}
                disabled={isGenerating || isQuotaBlocked}
                className="group relative text-left p-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] disabled:opacity-50 border border-[#E2E8F0] hover:border-[#3B82F6]/50 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 focus:outline-none cursor-pointer flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${prompt.color}`}>
                    {prompt.tag}
                  </span>
                  <span className="w-5 h-5 rounded-md bg-secondary group-hover:bg-blue-600 group-hover:text-white text-stone-400 flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs font-normal text-stone-700 group-hover:text-blue-700 leading-relaxed transition-colors">
                  {prompt.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Elevated Compact Input Bar ─── */}
      <div className="px-5 py-3 bg-white border-t border-[#F5F0E8] shrink-0">
        <div role="group" aria-label="Khung nhập tin nhắn AI" className="w-full min-w-0 max-w-5xl mx-auto space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isGenerating || isQuotaBlocked}
                placeholder={isGenerating ? "Nova đang tổng hợp câu trả lời cho bạn..." : "Hỏi Nova bất cứ điều gì về bài tập hay lộ trình học bối rối nhé..."}
                className="w-full bg-[#F8FAFC] focus:bg-white disabled:bg-gray-100 border border-[#E2E8F0] focus:border-[#3B82F6] rounded-xl pl-4 pr-24 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#9092A8] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 font-medium"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400 hidden sm:flex items-center gap-1">
                <CornerDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Tạm dừng câu trả lời"
                className="shrink-0 w-11 h-11 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all duration-200 focus:outline-none shadow-sm cursor-pointer"
              >
                <CircleStop className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isQuotaBlocked}
                aria-label="Send message"
                className="shrink-0 w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-sm cursor-pointer"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-normal text-[#64748B] pt-1 text-center">
            {quota && (
              <span aria-label="Hạn mức AI hôm nay" className="shrink-0 text-[11px] text-[#64748B]">
                Còn {quota.remaining}/{quota.daily_limit} lượt hôm nay
              </span>
            )}
            <span> <strong>Mẹo nhỏ:</strong> Bạn có thể dán công thức toán học, bài toán khó hoặc xin code ví dụ bằng Python/JavaScript trực tiếp.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
