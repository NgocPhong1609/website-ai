"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "ai";
  text: string;
  image?: string | null; // Hỗ trợ hiển thị ảnh trong khung chat
}

interface AiNovaTabProps {
  videoId: string | number;
  videoUrl?: string;
  geminiFileUri?: string | null;
}

export function AiNovaTab({ videoId, videoUrl, geminiFileUri }: AiNovaTabProps) {
  const [question, setQuestion] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`chat_${videoId}`);
      if (saved) return JSON.parse(saved);
    }
    return [{ role: "ai", text: "Chào bạn! Mình là Nova - Cố vấn Học tập AI của bạn đây. 🚀 Mình có thể phân tích video hoặc xem ảnh bạn gửi. Bạn cần mình hỗ trợ gì nào?" }];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem(`chat_${videoId}`, JSON.stringify(chatHistory));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, videoId]);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Chuyển ảnh thành Base64
      };
      reader.readAsDataURL(file);
    }
    // Reset input để chọn lại file cũ nếu cần
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!question.trim() && !imagePreview) || isPending) return;

    const currentQuestion = question;
    const currentImage = imagePreview;
    
    // Đẩy tin nhắn của User lên giao diện
    setChatHistory((prev) => [...prev, { role: "user", text: currentQuestion, image: currentImage }]);
    setQuestion("");
    setImagePreview(null);
    setIsPending(true);

    try {
      const response = await axios.post("/api/course-ai", {
        action: "qa", 
        videoId: String(videoId), 
        question: currentQuestion,
        videoUrl: videoUrl,
        geminiFileUri: geminiFileUri,
        imageBase64: currentImage // 🟢 Gửi ảnh lên cho Google xem
      });
      
      if (response.data.success) {
        setChatHistory((prev) => [...prev, { role: "ai", text: response.data.data }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "ai", text: "❌ Lỗi: " + response.data.message }]);
      }
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : "Không thể kết nối đến AI. Kiểm tra server rồi thử lại.";
      setChatHistory((prev) => [...prev, { role: "ai", text: `❌ ${message}` }]);
    } finally {
      setIsPending(false);
    }
  };

  const handleClearChat = () => {
    const initChat: Message[] = [{ role: "ai", text: "Lịch sử đã được làm mới. 🌟 Bạn muốn hỏi gì tiếp theo nào?" }];
    setChatHistory(initChat);
    sessionStorage.setItem(`chat_${videoId}`, JSON.stringify(initChat));
  };

  return (
    <div className="flex flex-col h-[550px] border border-[#E5E7EB] rounded-2xl bg-[#F9FAFB] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">AI</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-sm">Cố vấn Nova</h3>
            <p className="text-xs text-green-600 font-medium">Hỗ trợ Video & Hình ảnh (Multimodal)</p>
          </div>
        </div>
        <button onClick={handleClearChat} className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1">Làm mới</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-[#4F46E5] text-white rounded-2xl rounded-tr-sm" : "bg-white border border-[#E5E7EB] text-[#111827] rounded-2xl rounded-tl-sm"}`}>
              {/* Nếu có ảnh thì hiển thị ảnh trước text */}
              {msg.image && (
                 <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-48 object-contain rounded-lg mb-2 border border-white/20" />
              )}
              {/* Dùng React Markdown ở đây sẽ đẹp hơn, nhưng hiện tại hiển thị text thường */}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-start">
             <div className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150"></span>
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Vùng chọn ảnh preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-gray-100 border-t border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src={imagePreview} alt="Preview" className="h-10 w-10 object-cover rounded shadow-sm border border-gray-300" />
                <span className="text-xs text-gray-500 font-medium">Đã đính kèm ảnh</span>
            </div>
            <button type="button" onClick={() => setImagePreview(null)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded">Xóa</button>
        </div>
      )}

      <form onSubmit={handleAsk} className="p-3 bg-white border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2 relative">
          
          {/* Nút Upload Ảnh */}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-200 hover:text-blue-600 transition-colors border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} disabled={isPending} placeholder="Hỏi nội dung video hoặc gửi ảnh cho AI..." className="flex-1 pl-4 pr-12 py-3 text-sm bg-gray-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:border-[#4F46E5] transition-all disabled:opacity-60" />
          <button type="submit" disabled={isPending || (!question.trim() && !imagePreview)} className="absolute right-2 p-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] disabled:bg-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
}