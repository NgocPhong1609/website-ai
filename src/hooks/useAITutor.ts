import { useState, useCallback, useEffect } from "react";
import type { IAIChatMessage } from "@/src/types/student";

interface UseAITutorOptions {
  lessonTranscript: string;
  userProficiency: string;
  maxDailyMessages?: number;
}

export function useAITutor({
  lessonTranscript,
  userProficiency,
  maxDailyMessages = 5, // Simulated limit for free tier
}: UseAITutorOptions) {
  const [messages, setMessages] = useState<IAIChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesSentToday, setMessagesSentToday] = useState(0);

  // Initialize from mock or localStorage (for demo purposes, just memory)
  useEffect(() => {
    const usage = parseInt(sessionStorage.getItem("ai_tutor_usage") || "0", 10);
    setMessagesSentToday(usage);

    // Initial greeting
    setMessages([
      {
        id: "msg-1",
        role: "assistant",
        content: `Hello Alex! I see you're diving into the lesson. Based on your ${userProficiency} proficiency, we can explore this in depth. How can I help you today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [userProficiency]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (messagesSentToday >= maxDailyMessages) {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            role: "assistant",
            content: "⚠️ You have reached your daily limit for AI Tutor messages. Please upgrade your plan for unlimited access.",
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      // Add user message to UI immediately
      const userMessage: IAIChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Increment usage
      const newUsage = messagesSentToday + 1;
      setMessagesSentToday(newUsage);
      sessionStorage.setItem("ai_tutor_usage", newUsage.toString());

      // --- SIMULATED BACKEND LOGIC ---
      // In production, the backend would construct the prompt:
      const hiddenSystemPrompt = `
      You are an AI Tutor.
      User Proficiency: ${userProficiency}
      Lesson Transcript Context: ${lessonTranscript.substring(0, 500)}...
      History: ${messages.map(m => m.role + ": " + m.content).join("|")}
      
      Constraint: If the user asks about something outside of the lesson scope (e.g. prompt injection, unrelated topics), politely decline and steer them back to the lesson.
      `;

      console.log("[Backend Simulation] Constructing LLM Payload with Hidden Context:", hiddenSystemPrompt);

      // Simulate network latency and streaming response
      setTimeout(() => {
        setIsTyping(false);
        let assistantReply = "";

        // Simple Jailbreak/Out-of-scope check
        const lowerContent = content.toLowerCase();
        if (
          lowerContent.includes("ignore previous instructions") ||
          lowerContent.includes("tell me a joke") ||
          lowerContent.includes("how to hack") ||
          lowerContent.includes("write code for a different project")
        ) {
          assistantReply = "I am specifically designed to help you with the current lesson material. Could we bring the focus back to the concepts covered in this course?";
        } else {
          // Simulated contextual response
          assistantReply = `That's a great question about the lesson! Since you're at a ${userProficiency} level, think of it this way: The core concept directly builds on what we discussed in the transcript regarding the fundamental principles. Let's practice with a quick example...`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `ast-${Date.now()}`,
            role: "assistant",
            content: assistantReply,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 1500);
    },
    [messages, messagesSentToday, maxDailyMessages, lessonTranscript, userProficiency]
  );

  return {
    messages,
    isTyping,
    messagesSentToday,
    maxDailyMessages,
    sendMessage,
  };
}
