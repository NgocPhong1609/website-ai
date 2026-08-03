"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { sendAiChatMessage } from "@/src/features/student/ai-study-plan/services/ai-chat.client-service";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
}

export function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Hi Alex! 👋 I am Nova, your always-on AI study companion. How can I assist with your coursework or study plan today?",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        text: newAiMessage.text || "I have processed your coursework request. How else can I assist?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    },
    onError: (error) => {
      console.error("[FloatingAiChat] Failed to reach AI backend:", error);
      const fallbackReply: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "⚠️ **Nova AI**: I encountered a slight network hesitation reaching the learning server. Please retry in a moment!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    
    // Trigger React Query mutation per checklist.md Rule #4
    chatMutation.mutate(query);
  };

  const quickSuggestions = [
    "💡 Summarize my current progress",
    "🎯 Quiz me on recent lessons",
    "📖 Suggest what to study next",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[99999] pointer-events-auto">
      {/* Collapsed Button State - Prominent Floating Pill Badge */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open MindNova AI Assistant"
          className="group flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-[#4648D4] via-[#5254E2] to-[#4CD7F6] text-white font-bold shadow-[0_8px_32px_rgba(70,72,212,0.45)] hover:shadow-[0_12px_40px_rgba(70,72,212,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 focus:outline-none border-2 border-white/20 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-7 h-7 bg-white/15 rounded-full">
            {/* Sparkle AI icon */}
            <svg
              className="w-4.5 h-4.5 transform group-hover:rotate-12 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            {/* Active Status Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] border border-white" />
            </span>
          </div>
          
          <div className="flex flex-col text-left pr-1">
            <span className="text-[13px] sm:text-sm font-bold tracking-tight leading-tight drop-shadow-2xs">
              ✨ AI Assistant
            </span>
            <span className="text-[10px] text-[#E0F2FE] font-medium opacity-95">
              Online • Click to chat
            </span>
          </div>
        </button>
      )}

      {/* Expanded Floating Modal Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] md:w-[420px] h-[560px] max-h-[82vh] bg-white rounded-3xl shadow-[0_16px_60px_rgba(26,26,46,0.22)] border border-[#EAEAF4] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 origin-bottom-right">
          
          {/* Minimalist Header */}
          <header className="px-5 py-3.5 border-b border-[#EAEAF4] bg-[#FAFAFE] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] text-white flex items-center justify-center shadow-2xs text-xs font-bold">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#1A1A2E] tracking-tight">
                    MindNova AI Co-Pilot
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Online" />
                </div>
                <p className="text-[11px] font-medium text-[#7878A0]">Ready across all student courses</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              title="Minimize chat"
              className="w-8 h-8 rounded-xl hover:bg-[#EAEAF4]/70 text-[#64647A] hover:text-[#1A1A2E] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#FCFDFE]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                {msg.sender === "ai" ? (
                  <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#6B6BFF] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs border border-[#6B6BFF]/20">
                    N
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 border border-[#EAEAF4] shadow-2xs">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                      width={28}
                      height={28}
                      sizes="28px"
                      alt="You"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : ""}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#4648D4] to-[#6B6BFF] text-white rounded-tr-none shadow-2xs font-medium"
                        : "bg-[#F4F5FB] text-[#1A1A2E] border border-[#EAEAF4]/70 rounded-tl-none font-normal"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9090A0] px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {chatMutation.isPending && (
              <div className="flex items-start gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#6B6BFF] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs border border-[#6B6BFF]/20 animate-pulse">
                  N
                </div>
                <div className="bg-[#F4F5FB] border border-[#EAEAF4]/70 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#6B6BFF] mr-1">Nova is analyzing...</span>
                  <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Minimalist Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-[#F0F0F8] bg-white flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item)}
                disabled={chatMutation.isPending}
                className="shrink-0 text-xs font-semibold bg-[#FAFAFE] hover:bg-[#EEF2FF] disabled:opacity-50 text-[#4A4B68] hover:text-[#4648D4] border border-[#E8E8F2] hover:border-[#6B6BFF]/40 rounded-xl px-3 py-1.5 transition-colors focus:outline-none cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Minimalist Footer Input Bar */}
          <div className="p-3 bg-white border-t border-[#EAEAF4] shrink-0">
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
                placeholder="Ask Nova a question..."
                className="flex-1 bg-[#F8F9FE] focus:bg-white disabled:bg-gray-100 border border-[#E4E4EE] focus:border-[#6B6BFF] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A2E] placeholder:text-[#9090A0] focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || chatMutation.isPending}
                className="shrink-0 w-10 h-10 flex items-center justify-center bg-[#6B6BFF] hover:bg-[#5254E2] disabled:opacity-50 text-white rounded-xl transition-all duration-200 focus:outline-none shadow-2xs active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
