"use client";

import { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SparklesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Xin chào! 👋 Tôi là **Nova**, trợ lý AI học tập của bạn.\n\nTôi có thể giúp bạn:\n• Giải thích khái niệm khó\n• Tóm tắt nội dung khóa học\n• Kiểm tra kiến thức bằng câu hỏi\n• Lập kế hoạch học tập\n\nBạn cần hỗ trợ gì hôm nay?",
    time: getTime(),
  },
];

const QUICK_ACTIONS = [
  { label: "📊 Tổng hợp tiến độ", prompt: "Tổng hợp tiến độ học tập của tôi" },
  { label: "🧠 Kiểm tra kiến thức", prompt: "Hãy kiểm tra kiến thức của tôi" },
];

const DEMO_RESPONSES: Record<string, string> = {
  default:
    "Tôi đã nhận được câu hỏi của bạn! 🤔 Đây là chức năng demo — trong phiên bản thực tế, Nova sẽ kết nối với AI để trả lời chi tiết dựa trên nội dung khóa học của bạn.",
  "Tổng hợp tiến độ học tập của tôi":
    "📊 **Tổng hợp tiến độ học tập:**\n\nDựa trên dữ liệu của bạn:\n• Bạn đang học **3 khóa học** đang tiến hành\n• Tiến độ trung bình: **~60%**\n• Bài học tiếp theo được đề xuất: Route Handlers & Server Actions\n\nHãy duy trì đà học tập này! 🚀",
  "Hãy kiểm tra kiến thức của tôi":
    "🧠 **Câu hỏi kiểm tra:**\n\nTrong Next.js, **Server Components** và **Client Components** khác nhau như thế nào?\n\nA) Server Components chạy trên server, Client Components chạy trên browser\nB) Không có sự khác biệt\nC) Server Components chỉ dùng cho API routes\n\nHãy chọn đáp án bạn cho là đúng!",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate response delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));

    const responseText =
      DEMO_RESPONSES[trimmed] ?? DEMO_RESPONSES["default"];

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      time: getTime(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => setMessages(INITIAL_MESSAGES);

  // Format bold **text** in messages
  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 z-50 flex flex-col bg-white rounded-2xl shadow-[0_8px_40px_rgba(107,107,255,0.18)] border border-[#EAEAF4] overflow-hidden"
          style={{ width: 340, height: 480 }}
          role="dialog"
          aria-label="Nova AI Co-Pilot"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#4143CB] to-[#6B6BFF] shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <SparklesIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold text-white truncate">
                  Nova AI Co-Pilot
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0" />
              </div>
              <p className="text-[10px] text-white/70 truncate">
                Trợ lý học tập 24/7
              </p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              aria-label="Xóa lịch sử"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <TrashIcon />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#F7F7FB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                    N
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#5153DF] text-white rounded-tr-sm"
                        : "bg-white text-[#1A1A2E] rounded-tl-sm border border-[#EAEAF4] shadow-sm"
                    }`}
                  >
                    {formatContent(msg.content)}
                  </div>
                  <span className="text-[10px] text-[#A0A0C0] px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  N
                </div>
                <div className="bg-white border border-[#EAEAF4] shadow-sm px-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 px-3 pt-2 pb-1 bg-white border-t border-[#F0F0F8] shrink-0 overflow-x-auto scrollbar-none">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => sendMessage(action.prompt)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#F0F0FF] text-[#4648D4] font-medium hover:bg-[#E0E0FF] transition-colors whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-[#F6F6FB] border border-[#EAEAF4] rounded-xl px-3 py-2 focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/10 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi cho Nova..."
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-[#1A1A2E] placeholder-[#B0B0C8] resize-none outline-none max-h-[80px] leading-relaxed"
                style={{ minHeight: "20px" }}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                aria-label="Gửi tin nhắn"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#6B6BFF] text-white hover:bg-[#5153DF] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Đóng Nova AI" : "Mở Nova AI Co-Pilot"}
        className="fixed bottom-5 right-5 z-50 w-13 h-13 rounded-2xl bg-gradient-to-br from-[#4143CB] to-[#6B6BFF] text-white shadow-[0_4px_20px_rgba(107,107,255,0.45)] hover:shadow-[0_6px_28px_rgba(107,107,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/30"
        style={{ width: 52, height: 52 }}
      >
        {isOpen ? <XIcon /> : <SparklesIcon />}
        {/* Unread dot when closed */}
        {!isOpen && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#34D399] border-2 border-white animate-pulse" />
        )}
      </button>
    </>
  );
}
