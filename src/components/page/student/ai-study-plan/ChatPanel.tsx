"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadIcon, MoreVerticalIcon, SparklesIcon, RobotIcon, SendIcon } from "./icons";
import { useAITutor } from "../../../../hooks/useAITutor";

export function ChatPanel() {
  const [inputValue, setInputValue] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Initialize the hook with mock context from COURSE_DETAIL
  const { messages, isTyping, messagesSentToday, maxDailyMessages, sendMessage } = useAITutor({
    lessonTranscript: "In this lesson, we will cover the fundamentals of Quantum Computing, including superposition and entanglement...",
    userProficiency: "Intermediate",
    maxDailyMessages: 5,
  });

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F7FB]">
      {/* Header */}
      <header className="h-[72px] shrink-0 bg-transparent flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B28CC] to-[#6B6BFF] flex items-center justify-center text-white shadow-md">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A2E] leading-tight">Nova</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-bold tracking-widest text-[#6B6BFF] uppercase">
                AI Tutor Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#A0A0C0]">
          <div className="text-[12px] font-semibold text-[#7878A0] bg-white px-3 py-1.5 rounded-full border border-[#EAEAF4] shadow-sm">
            {messagesSentToday}/{maxDailyMessages} Messages Today
          </div>
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <UploadIcon className="w-5 h-5" />
          </button>
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-8">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${isUser ? "self-end" : ""}`}>
              {!isUser && (
                <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
                  <RobotIcon className="w-4 h-4" />
                </div>
              )}

              <div className={`flex flex-col gap-2 ${isUser ? "items-end" : ""}`}>
                <div
                  className={`p-5 rounded-2xl shadow-md ${
                    isUser
                      ? "bg-[#5153DF] text-white rounded-tr-sm"
                      : msg.id.startsWith("sys-")
                      ? "bg-red-50 border border-red-200 text-red-800 rounded-tl-sm shadow-none"
                      : "bg-gradient-to-br from-[#4143CB] via-[#2A6593] to-[#0C8D89] text-white rounded-tl-sm"
                  }`}
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className={`text-[11px] text-[#A0A0C0] ${isUser ? "mr-1" : "ml-1"}`}>
                  {isUser ? "You" : "Nova"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden shrink-0 mt-1 border-2 border-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}

        {/* Nova Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
              <RobotIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div className="bg-white border border-[#EAEAF4] px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 w-fit">
                <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#F7F7FB] shrink-0 pb-10">
         <div className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || messagesSentToday >= maxDailyMessages}
              placeholder={messagesSentToday >= maxDailyMessages ? "Daily limit reached." : "Ask Nova a question..."}
              className="w-full bg-white border border-[#EAEAF4] rounded-full pl-6 pr-14 py-4 text-[14px] shadow-sm focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || messagesSentToday >= maxDailyMessages || !inputValue.trim()}
              className="absolute right-3 top-2.5 w-9 h-9 flex items-center justify-center bg-[#6B6BFF] text-white rounded-full hover:bg-[#5153DF] transition-colors shadow-sm focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
               <SendIcon className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
