"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadIcon, MoreVerticalIcon, SparklesIcon, RobotIcon, SendIcon } from "./icons";
import { useAITutor } from "@/src/hooks/useAITutor";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";

export function ChatPanel() {
  const [inputValue, setInputValue] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const { messages, isTyping, messagesSentToday, maxDailyMessages, sendMessage } = useAITutor({
    lessonTranscript:
      "Trong học phần này, chúng ta nghiên cứu các kiến trúc phần mềm Fullstack hiện đại, xử lý bất đồng bộ trong Next.js 15 và cách tối ưu mô hình RAG Vector AI...",
    userProficiency: "Intermediate",
    maxDailyMessages: 10,
  });

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 shrink-0 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-2xs">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 leading-tight">Nova AI Tutor</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-wider text-[#4F46E5] uppercase font-mono">
                Gia sư trực tuyến 24/7
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-400">
          <div className="text-xs font-bold text-gray-600 bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-2xs font-mono">
            {messagesSentToday}/{maxDailyMessages} câu hỏi hôm nay
          </div>
          <button type="button" title="Tải tài liệu lên cho AI analyze" className="hover:text-gray-700 transition-colors focus:outline-none p-1 cursor-pointer">
            <UploadIcon className="w-5 h-5" />
          </button>
          <button type="button" title="Tùy chọn gia sư" className="hover:text-gray-700 transition-colors focus:outline-none p-1 cursor-pointer">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-gray-50/20">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#4F46E5] shadow-2xs">
                  <RobotIcon className="w-4 h-4" />
                </div>
              )}

              <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-2xs ${
                    isUser
                      ? "bg-[#4F46E5] text-white rounded-tr-xs"
                      : msg.id.startsWith("sys-")
                      ? "bg-red-50 border border-red-200 text-red-800 rounded-tl-xs shadow-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] font-extrabold text-gray-400 font-mono px-1">
                  {isUser ? "Bạn" : "Nova"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 font-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-indigo-500">
                  <span>ME</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Nova Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#4F46E5] shadow-2xs">
              <RobotIcon className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-1.5 w-fit">
              <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Terminal Area */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <div className="relative max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping || messagesSentToday >= maxDailyMessages}
            placeholder={
              messagesSentToday >= maxDailyMessages
                ? "Bạn đã đạt giới hạn số câu hỏi trong ngày."
                : "Hỏi Nova giải thích kiến trúc code, thuật toán hoặc lỗi phần mềm..."
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-xs font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#4F46E5] transition-all shadow-2xs disabled:bg-gray-100 disabled:text-gray-400"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isTyping || messagesSentToday >= maxDailyMessages || !inputValue.trim()}
            className="absolute right-2.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg transition-all shadow-2xs focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer my-0.5"
            title="Gửi câu hỏi"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
