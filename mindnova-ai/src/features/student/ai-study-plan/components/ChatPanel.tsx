"use client";

import React, { useState, useRef, useEffect } from "react";
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
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <UploadIcon className="w-5 h-5" />
          </button>
          <button className="hover:text-[#6B6BFF] transition-colors focus:outline-none">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

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
              </div>
            </div>
          </div>
        )}
        
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
      </div>

    </div>
  );
}