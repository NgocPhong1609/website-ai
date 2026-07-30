"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useOnboardingStore } from "@/src/components/page/student/onboarding/stores/onboardingStore";
import type { IChatMessage, IAICourseRecommendation } from "@/src/components/page/student/onboarding/types";
import { GuestAuthModal } from "@/src/components/page/student/onboarding/auth/GuestAuthModal";

// ─── Mock RAG Course Database ────────────────────────────────────────────────

const MOCK_RAG_COURSES: Record<string, IAICourseRecommendation> = {
  frontend: {
    id: "mno-fe-101",
    title: "Complete Modern Frontend Career Path: React & Next.js 15",
    instructor: "David Miller & MindNova AI Core",
    rating: 4.9,
    reviewCount: 3420,
    originalPrice: "$149.00",
    price: "$29.00",
    discountPercent: "80% OFF",
    level: "All Levels • 42 hrs",
    duration: "148 interactive lectures",
    thumbnail: "/icons/gemini.svg",
  },
  backend: {
    id: "mno-be-202",
    title: "Distributed Backend Architecture: Node, Python & Microservices",
    instructor: "Elena Rostova (Senior Principal Eng)",
    rating: 4.85,
    reviewCount: 1980,
    originalPrice: "$179.00",
    price: "$39.00",
    discountPercent: "78% OFF",
    level: "Intermediate • 56 hrs",
    duration: "210 real-world projects",
    thumbnail: "/icons/brain.svg",
  },
  ai: {
    id: "mno-ai-303",
    title: "Applied Generative AI & RAG Engineering Bootcamp",
    instructor: "Dr. Marcus Vance (DeepMind Alumni)",
    rating: 4.98,
    reviewCount: 5120,
    originalPrice: "$249.00",
    price: "$49.00",
    discountPercent: "80% OFF",
    level: "Advanced • 64 hrs",
    duration: "Live sandbox + 12 AI agents",
    thumbnail: "/icons/gemini2.svg",
  },
};

// ─── Mini Course Card Component ──────────────────────────────────────────────

function MiniCourseCard({
  course,
  onEnrollClick,
}: {
  course: IAICourseRecommendation;
  onEnrollClick: (courseName: string) => void;
}) {
  return (
    <div className="w-full mt-3 rounded-2xl bg-[#F8F9FE] border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all group">
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-200/50 flex items-center justify-center shrink-0">
            <Image src={course.thumbnail} width={22} height={22} alt="" aria-hidden="true" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wider uppercase">
            {course.discountPercent}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-[#131B2E] line-clamp-2 group-hover:text-[#4648D4] transition-colors">
            {course.title}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5 font-medium">By {course.instructor}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#131B2E]">
          <span className="text-amber-500 font-black">★ {course.rating}</span>
          <span className="text-gray-400 font-normal">({course.reviewCount.toLocaleString()} reviews)</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 text-[11px] font-normal">{course.level}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200/60 pt-2.5 mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#4648D4]">{course.price}</span>
            <span className="text-xs text-gray-400 line-through font-medium">{course.originalPrice}</span>
          </div>

          <button
            type="button"
            onClick={() => onEnrollClick(course.title)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white font-bold text-xs shadow-sm hover:shadow hover:opacity-95 transition-all cursor-pointer"
          >
            Enroll / Try Free Demo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Floating Chatbot ───────────────────────────────────────────────────

export function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string>("Log in now to chat unlimitedly with MindNova AI!");
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Guest limitation state: Max 3 questions / session
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const maxQuestions = 3;

  const isAuthenticated = useOnboardingStore((s) => s.isAuthenticated);

  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Hello there! 👋 Don't know where to start? Tell me your target career (e.g., Frontend, AI, Backend) and I will retrieve exact matching courses with special discount rates!",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isAiTyping]);

  const handleOpenAuth = useCallback((reason: string) => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiTyping) return;

    // Check rate limit if guest
    if (!isAuthenticated && questionsUsed >= maxQuestions) {
      handleOpenAuth("You have used up your free trials. Please log in to chat with AI unlimitedly!");
      return;
    }

    const userText = input.trim();
    const userMsg: IChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (!isAuthenticated) {
      setQuestionsUsed((prev) => prev + 1);
    }

    setIsAiTyping(true);

    // Simulate RAG retrieval and AI reply
    setTimeout(() => {
      let rec: IAICourseRecommendation | undefined = MOCK_RAG_COURSES.frontend;
      let replyText = "Based on your interest in modern web development, here is our highest-rated training track with active instructor mentoring:";
      
      const lower = userText.toLowerCase();
      if (lower.includes("ai") || lower.includes("data") || lower.includes("python") || lower.includes("machine")) {
        rec = MOCK_RAG_COURSES.ai;
        replyText = "AI & Generative Engineering is growing exponentially! I found our definitive bootcamp tailored for immediate industry integration:";
      } else if (lower.includes("backend") || lower.includes("node") || lower.includes("database") || lower.includes("devops")) {
        rec = MOCK_RAG_COURSES.backend;
        replyText = "Backend scaling and distributed architectures require robust fundamentals. Check out this comprehensive curriculum:";
      }

      const aiMsg: IChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        recommendation: rec,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 900);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Inviting Prompt Speech Bubble (when closed) */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-indigo-100 shadow-[0_10px_35px_rgba(107,107,255,0.25)] flex items-center gap-3 animate-bounce cursor-pointer hover:scale-105 transition-transform" 
            style={{ animationDuration: "3.5s" }}
          >
            <span className="text-xl">💡</span>
            <span className="text-xs font-extrabold text-[#131B2E]">
              Don&apos;t know where to start? <span className="text-[#6B6BFF] font-black">Let AI help!</span>
            </span>
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="pointer-events-auto w-80 sm:w-96 h-[520px] bg-white rounded-3xl shadow-[0_25px_80px_rgba(19,27,46,0.3)] border border-[#E2E8F0] flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#1E1E30] via-[#2A2A48] to-[#1E1E30] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6B6BFF] to-[#4CD7F6] flex items-center justify-center font-bold text-xs shadow-inner">
                  AI
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>MindNova Advisor</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-gray-300 font-medium">RAG Course Database connected</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Trial limit status bar for guests */}
            {!isAuthenticated && (
              <div className="px-4 py-2 bg-indigo-50/90 border-b border-indigo-100 flex items-center justify-between text-xs text-[#4648D4] font-bold">
                <span>⚡ Free Guest Queries: {maxQuestions - questionsUsed} / {maxQuestions} left</span>
                <button
                  type="button"
                  onClick={() => handleOpenAuth("Log in now to unlock unlimited AI advisory sessions!")}
                  className="underline hover:text-indigo-800 text-[11px] font-extrabold cursor-pointer"
                >
                  Unlock Unlimited
                </button>
              </div>
            )}

            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#F9FAFF]/50">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                      m.sender === "user"
                        ? "bg-[#6B6BFF] text-white rounded-br-none font-semibold"
                        : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
                    }`}
                  >
                    {m.text && <p>{m.text}</p>}
                    {m.recommendation && (
                      <MiniCourseCard
                        course={m.recommendation}
                        onEnrollClick={(title) =>
                          handleOpenAuth(`Log in now to preview and save your amazing progress in '${title}'!`)
                        }
                      />
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-none w-24 text-gray-400 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CD7F6] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              {/* Paywall Banner when free limit reached */}
              {!isAuthenticated && questionsUsed >= maxQuestions && (
                <div className="my-3 p-4 rounded-2xl bg-gradient-to-br from-[#1E1E30] to-[#3B3B6D] text-white text-center flex flex-col items-center gap-3 shadow-md">
                  <span className="text-2xl">🔒</span>
                  <h4 className="text-xs font-bold text-white">Free Trial Session Completed</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    You have used up your free trials. Please log in to chat with AI unlimitedly and save custom recommendations!
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenAuth("You have used up your free trials. Please log in to chat with AI unlimitedly!")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6B6BFF] via-[#818CF8] to-[#00C2B3] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
                  >
                    Log In / Register Now
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!isAuthenticated && questionsUsed >= maxQuestions}
                placeholder={
                  !isAuthenticated && questionsUsed >= maxQuestions
                    ? "Log in to unlock unlimited AI chat..."
                    : "Ask about AI, React, Data..."
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100 text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40 disabled:bg-gray-200 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={(!input.trim() || isAiTyping) && !(!isAuthenticated && questionsUsed >= maxQuestions)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] text-white flex items-center justify-center shrink-0 shadow-sm hover:shadow hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer"
              >
                ➔
              </button>
            </form>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto w-15 h-15 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] via-[#5848DF] to-[#00C2B3] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(107,107,255,0.45)] hover:shadow-[0_12px_40px_rgba(107,107,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 z-40"
        >
          {isOpen ? (
            <span className="text-2xl font-black">✕</span>
          ) : (
            <div className="relative">
              <span className="text-2xl font-bold">💬</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#5848DF] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#5848DF]" />
            </div>
          )}
        </button>
      </div>

      {/* Embedded Auth Modal */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        compellingReason={authReason}
        defaultTab="register"
      />
    </>
  );
}
