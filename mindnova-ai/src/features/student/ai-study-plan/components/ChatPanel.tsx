"use client";

import React, { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon, MoreVerticalIcon, RobotIcon, SendIcon } from "./icons";
import type { AiChatMessage } from "../types";
import { sendAiChatMessage } from "../services/ai-chat.client-service";

interface ChatPanelProps {
  initialMessages?: AiChatMessage[];
  syllabusTitle?: string;
  lessonId?: number;
}

export function ChatPanel({
  initialMessages = [
    {
      id: "msg-init",
      sender: "ai",
      timestamp: "Just now",
      text: "Greetings! I am **Nova**, your personal AI Study Co-Pilot. We are currently focusing on **Module 4: Quantum Computing Fundamentals**.\n\nYou've already mastered Superposition! Do you want to dive deeper into **Entanglement mathematics**, or should we run a simulation on **Qubit Gate architectures** today?",
    },
  ],
  syllabusTitle = "Quantum Computing Fundamentals",
  lessonId,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    { id: 1, text: "✨ Simplify superposition with an analogy", query: "Simplify superposition with a quick analogy" },
    { id: 2, text: "🎯 Generate 3 practice review questions", query: "Generate 3 practice review questions" },
    { id: 3, text: "💡 Explain Quantum Entanglement simply", query: "Explain Quantum Entanglement in plain terms" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, messagesEndRef]);

  const chatMutation = useMutation({
    mutationFn: (messageText: string) => sendAiChatMessage(messageText, messages, lessonId),
    onSuccess: (newAiMessage) => {
      setMessages((prev) => [...prev, newAiMessage]);
    },
    onError: (error) => {
      console.error("[ChatPanel] AI Tutor response failed:", error);
      const errorMessage: AiChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "⚠️ **Nova AI**: I encountered a network pause while communicating with the learning core. Please check your connection or retry your query in a moment!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || chatMutation.isPending) return;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-[660px] h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-[#E4E4F2] shadow-[0_12px_40px_rgba(26,26,46,0.06)] relative overflow-hidden transition-all duration-300">
      
      {/* ─── Engaging Luminous Chat Header ─── */}
      <header className="h-18 shrink-0 bg-gradient-to-r from-white via-[#FAFAF5] to-[#F4F5FF] border-b border-[#EAECEF] flex items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] via-[#5052EE] to-[#4CD7F6] text-white flex items-center justify-center font-bold shadow-[0_4px_16px_rgba(107,107,255,0.4)] transform hover:rotate-12 transition-transform duration-300">
            <RobotIcon className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white animate-pulse" />
=======
import { UploadIcon, MoreVerticalIcon, SparklesIcon, RobotIcon, SendIcon } from "./icons";

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  role: "ai" | "user";
  content: string;
}

export function ChatPanel() {
  // 1. Khởi tạo danh sách tin nhắn mẫu cho giống giao diện ban đầu
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello Alex! I see you're diving into the Quantum Computing Fundamentals lesson today. How's it going?\n\nWe just finished talking about superposition. Do you want to try a quick thought experiment to solidify that, or shall we move on to entanglement?",
    },
    {
      role: "user",
      content: "Hey Nova! Superposition is a bit trippy. Can you explain it again but maybe using a simpler analogy? The 'spinning coin' one from the lecture was okay, but I need something more concrete.",
    },
  ]);

  // 2. Các State quản lý trạng thái gõ chữ và Streaming
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState("");
  
  // Dùng để tự động cuộn xuống cuối cùng khi có tin nhắn mới
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingText, isTyping]);

  // 3. Hàm xử lý khi bấm nút Gửi
  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    
    // Thêm tin nhắn của User vào giao diện
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInputText(""); // Xóa trắng ô input
    setIsTyping(true); // Hiện hiệu ứng AI đang suy nghĩ
    setCurrentStreamingText("");

    try {
      // Gọi sang API Backend Laravel của bạn (Cổng 8000)
      const response = await fetch("http://127.0.0.1:8000/api/student/chat-tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          // Tạm thời comment Authorization lại nếu bạn đã tắt auth:sanctum bên backend
          // "Authorization": `Bearer TOKEN_CUA_BAN_O_DAY`, 
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối đến server");
      }

      // 4. Xử lý luồng dữ liệu (Streaming) chảy về từ Backend
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";

      if (reader) {
        setIsTyping(false); // Tắt hiệu ứng suy nghĩ, bắt đầu hiện chữ

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Dịch mã chunk dữ liệu và nối vào chuỗi
          const chunk = decoder.decode(value, { stream: true });
          aiResponseText += chunk;
          
          // Cập nhật giao diện liên tục
          setCurrentStreamingText(aiResponseText);
        }
      }

      // 5. Khi luồng kết thúc, lưu tin nhắn hoàn chỉnh vào mảng chính
      setMessages((prev) => [...prev, { role: "ai", content: aiResponseText }]);
      setCurrentStreamingText("");

    } catch (error) {
      console.error("Lỗi:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Xin lỗi, hiện tại tôi đang gặp sự cố kết nối. Vui lòng thử lại sau!" }]);
      setIsTyping(false);
    }
  };

  // Hàm hỗ trợ ấn Enter để gửi
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F7FB]">
      {/* Header (Giữ nguyên) */}
      <header className="h-[72px] shrink-0 bg-transparent flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B28CC] to-[#6B6BFF] flex items-center justify-center text-white shadow-md">
            <SparklesIcon className="w-5 h-5" />
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1A1A2E] tracking-tight">
                Nova AI Tutor Room
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#0D9488] font-bold bg-[#D1FAE5] px-2.5 py-0.5 rounded-full border border-[#10B981]/25 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                Live Co-Pilot
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6B6BFF]">Interactive guidance for {syllabusTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#64647A]">
          <button
            type="button"
            aria-label="Upload document for context"
            className="p-2.5 rounded-xl hover:bg-white hover:text-[#4648D4] border border-transparent hover:border-[#EAEAF4] shadow-2xs hover:shadow-sm transition-all focus:outline-none cursor-pointer"
            title="Upload material"
          >
            <UploadIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Room configuration"
            className="p-2.5 rounded-xl hover:bg-white hover:text-[#4648D4] border border-transparent hover:border-[#EAEAF4] shadow-2xs hover:shadow-sm transition-all focus:outline-none cursor-pointer"
            title="More options"
          >
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

<<<<<<< HEAD
      {/* ─── Messages Stream with Soft Luminous Backdrop ─── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 bg-gradient-to-b from-[#F9FAFF] via-[#FAFAFE] to-[#F4F6FC]/70">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";

          return isAi ? (
            /* Nova AI Message */
            <div key={msg.id} className="flex items-start gap-3.5 max-w-[90%] sm:max-w-[80%] group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-[0_4px_12px_rgba(107,107,255,0.3)] text-xs font-bold transform group-hover:scale-105 transition-transform">
                <RobotIcon className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xs font-bold text-[#4648D4] tracking-wide">Nova Co-Pilot</span>
                  <span className="text-[11px] font-medium text-[#8888A8]">{msg.timestamp}</span>
                </div>
                <div className="bg-white text-[#1A1A2E] p-5 rounded-2xl rounded-tl-none border border-[#E2E4F0] border-l-4 border-l-[#6B6BFF] shadow-[0_4px_20px_rgba(26,26,46,0.03)] group-hover:shadow-[0_6px_24px_rgba(26,26,46,0.06)] text-sm sm:text-[14.5px] leading-relaxed whitespace-pre-line font-normal transition-shadow">
                  {msg.text}
                </div>
              </div>
            </div>
          ) : (
            /* User Message */
            <div key={msg.id} className="flex items-start gap-3.5 max-w-[90%] sm:max-w-[80%] self-end flex-row-reverse group">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5 border-2 border-[#6B6BFF] shadow-sm transform group-hover:scale-105 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                  width={36}
                  height={36}
                  sizes="36px"
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-1.5 items-end flex-1 min-w-0">
                <div className="flex items-center gap-2 mr-1">
                  <span className="text-[11px] font-medium text-[#8888A8]">{msg.timestamp}</span>
                  <span className="text-xs font-bold text-[#1A1A2E]">You</span>
                </div>
                <div className="bg-gradient-to-r from-[#4648D4] via-[#5254E2] to-[#6B6BFF] text-white p-5 rounded-2xl rounded-tr-none text-sm sm:text-[14.5px] leading-relaxed shadow-[0_6px_24px_rgba(70,72,212,0.28)] font-medium whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Nova Live Typing Indicator */}
        {chatMutation.isPending && (
          <div className="flex items-start gap-3.5 max-w-[85%]">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-[0_4px_12px_rgba(107,107,255,0.4)] animate-pulse">
              <RobotIcon className="w-4.5 h-4.5" />
            </div>
            <div className="bg-white border border-[#E2E4F0] border-l-4 border-l-[#6B6BFF] px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2.5 w-fit">
              <span className="text-xs font-bold text-[#6B6BFF]">Synthesizing interactive solution via MindNova AI</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#6B6BFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
=======
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-8">
        
        {/* Lặp qua mảng tin nhắn để hiển thị */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "self-end" : ""}`}>
            
            {/* Avatar AI */}
            {msg.role === "ai" && (
              <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
                <RobotIcon className="w-4 h-4" />
              </div>
            )}

            {/* Nội dung tin nhắn */}
            <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : ""}`}>
              <div className={msg.role === "ai" 
                  ? "bg-gradient-to-br from-[#4143CB] via-[#2A6593] to-[#0C8D89] text-white p-5 rounded-2xl rounded-tl-sm shadow-md"
                  : "bg-[#5153DF] text-white p-5 rounded-2xl rounded-tr-sm shadow-md"
              }>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
              <span className="text-[11px] text-[#A0A0C0] mx-1">
                {msg.role === "ai" ? "Nova" : "You"}
              </span>
            </div>

            {/* Avatar User */}
            {msg.role === "user" && (
              <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden shrink-0 mt-1 border-2 border-white shadow-sm">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}

        {/* Khối hiển thị chữ đang "chảy" (Streaming) */}
        {currentStreamingText && (
           <div className="flex gap-4 max-w-[85%]">
           <div className="w-9 h-9 rounded-full bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 mt-1 shadow-sm text-[#6B6BFF]">
             <RobotIcon className="w-4 h-4" />
           </div>
           <div className="flex flex-col gap-2">
             <div className="bg-gradient-to-br from-[#4143CB] via-[#2A6593] to-[#0C8D89] text-white p-5 rounded-2xl rounded-tl-sm shadow-md">
               <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                 {currentStreamingText}
               </p>
             </div>
             <span className="text-[11px] text-[#A0A0C0] ml-1">Nova is typing...</span>
           </div>
         </div>
        )}

        {/* Khối hiển thị dấu 3 chấm (AI đang chờ response) */}
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
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7
              </div>
            </div>
          </div>
        )}
<<<<<<< HEAD

        <div ref={messagesEndRef} />

        {/* ─── Interactive Luminous Quick-Prompts ─── */}
        <div className="mt-6 pt-5 border-t border-[#E8EAEE] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7878A0] uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯 Recommended Interactive Queries</span>
            </span>
            <span className="text-[11px] font-bold text-[#6B6BFF] bg-[#EEF2FF] px-2 py-0.5 rounded-md">One-click ask</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSend(prompt.query)}
                disabled={chatMutation.isPending}
                className="text-left px-4 py-2.5 rounded-xl bg-gradient-to-r from-white to-[#FAFAFE] hover:from-[#EEF2FF]/80 hover:to-[#E0F2FE]/80 disabled:opacity-50 text-xs font-bold text-[#4648D4] hover:text-[#2E30A0] border border-[#E2E4F0] hover:border-[#6B6BFF]/50 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                {prompt.text} ↗
              </button>
            ))}
          </div>
        </div>
=======
        
        {/* Điểm neo để tự động cuộn xuống */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-6 bg-[#F7F7FB] shrink-0 pb-10">
         <div className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nova a question..." 
              disabled={isTyping || currentStreamingText !== ""}
              className="w-full bg-white border border-[#EAEAF4] rounded-full pl-6 pr-14 py-4 text-[14px] shadow-sm focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || currentStreamingText !== "" || !inputText.trim()}
              className="absolute right-3 top-2.5 w-9 h-9 flex items-center justify-center bg-[#6B6BFF] text-white rounded-full hover:bg-[#5153DF] transition-colors shadow-sm focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
               <SendIcon className="w-4 h-4" />
            </button>
         </div>
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7
      </div>

      {/* ─── Elevated Floating Input Bar ─── */}
      <div className="p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-[#EAEAF4] shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatMutation.isPending}
            placeholder="Ask Nova anything about equations, concepts, or simulation experiments..."
            className="w-full bg-[#F8F9FF] focus:bg-white disabled:bg-gray-100 border border-[#E2E4F0] focus:border-[#6B6BFF] rounded-2xl px-5 py-4 text-sm text-[#1A1A2E] placeholder:text-[#9090B0] shadow-inner focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/15 transition-all duration-200 font-medium"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={chatMutation.isPending || !inputText.trim()}
            aria-label="Send message"
            className="shrink-0 px-7 py-4 flex items-center justify-center bg-gradient-to-r from-[#5052EE] via-[#6669F6] to-[#4CD7F6] hover:brightness-110 disabled:opacity-60 disabled:pointer-events-none text-white rounded-2xl text-sm font-bold transition-all duration-200 focus:outline-none shadow-[0_6px_20px_rgba(96,99,238,0.35)] hover:shadow-[0_8px_28px_rgba(96,99,238,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Send</span>
            <SendIcon className="w-4.5 h-4.5 ml-2 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}