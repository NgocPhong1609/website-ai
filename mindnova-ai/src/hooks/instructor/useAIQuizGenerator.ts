"use client";

import { useState, useCallback } from "react";

export type QuestionType = "multiple_choice" | "true_false" | "coding_challenge";
export type ReviewStatus = "pending" | "approved" | "edited" | "discarded";

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  distractors: string[]; // for multiple choice
  explanation: string;
  codeSnippet?: string;
  reviewStatus: ReviewStatus;
}

export interface UseAIQuizGeneratorReturn {
  isGenerating: boolean;
  questions: GeneratedQuestion[];
  transcriptSource: string;
  setTranscriptSource: (txt: string) => void;
  generateFromTranscript: (lessonTitle: string) => void;
  approveQuestion: (id: string) => void;
  editQuestion: (id: string, newText: string, newAnswer: string) => void;
  discardQuestion: (id: string) => void;
  approvedCount: number;
}

const MOCK_TRANSCRIPT_SAMPLE = `In Next.js 15, React Server Components (RSC) are the default rendering paradigm. Because Server Components run exclusively on the Node or Edge runtime, they can directly query databases and private internal microservices without exposing sensitive environment variables or serialization overhead to the browser client. To handle interactivity, such as onClick event listeners and state management hooks (useState, useEffect), engineers must prepend the 'use client' boundary directive at the top of the deepest leaf component possible to keep client JavaScript bundles lean and highly optimized.`;

export function useAIQuizGenerator(): UseAIQuizGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [transcriptSource, setTranscriptSource] = useState<string>(MOCK_TRANSCRIPT_SAMPLE);

  const generateFromTranscript = useCallback((lessonTitle: string) => {
    setIsGenerating(true);
    setQuestions([]);

    console.info(`[AI Co-Creator] Analyzing transcript for "${lessonTitle}"...`);
    console.info(`[AI Co-Creator] Extracting contextual multiple-choice & coding challenges...`);

    setTimeout(() => {
      const generated: GeneratedQuestion[] = [
        {
          id: "q-ai-101",
          type: "multiple_choice",
          question: "Why should the 'use client' directive be placed at the deepest leaf components possible in Next.js App Router?",
          correctAnswer: "To minimize client JavaScript bundle sizes and optimize network hydration payload.",
          distractors: [
            "Because React Server Components cannot render inside CSS grid containers.",
            "To bypass Node.js memory limit restrictions during API route execution.",
            "To force Server Actions to run synchronously within localStorage.",
          ],
          explanation: "Pushing 'use client' down ensures that heavy surrounding wrapper layouts remain server-rendered and zero-bundle.",
          reviewStatus: "pending",
        },
        {
          id: "q-ai-102",
          type: "true_false",
          question: "React Server Components (RSC) allow developers to directly access secure backend resources without exposing environment keys to the browser client.",
          correctAnswer: "True",
          distractors: ["False"],
          explanation: "Server Components run strictly on the server; client bundles never receive server private variables.",
          reviewStatus: "pending",
        },
        {
          id: "q-ai-103",
          type: "coding_challenge",
          question: "Identify the missing Edge async response wrapper in this custom Route Handler validation pattern:",
          correctAnswer: "export async function POST(req: NextRequest) { const body = await req.json(); ... }",
          distractors: [
            "export function POST(req) { return req.body; }",
            "const handler = (req, res) => { res.send(200); };",
          ],
          codeSnippet: `// Broken code snippet from lesson transcript:\nexport function POST(req) {\n  const data = req.json();\n  return new Response("OK");\n}`,
          explanation: "Edge Route Handlers must be async functions and await req.json() to properly unpack stream buffers.",
          reviewStatus: "pending",
        },
      ];

      setQuestions(generated);
      setIsGenerating(false);
    }, 1800);
  }, []);

  const approveQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "approved" } : q))
    );
  }, []);

  const editQuestion = useCallback((id: string, newText: string, newAnswer: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, question: newText, correctAnswer: newAnswer, reviewStatus: "edited" } : q
      )
    );
  }, []);

  const discardQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reviewStatus: "discarded" } : q))
    );
  }, []);

  const approvedCount = questions.filter((q) => q.reviewStatus === "approved" || q.reviewStatus === "edited").length;

  return {
    isGenerating,
    questions,
    transcriptSource,
    setTranscriptSource,
    generateFromTranscript,
    approveQuestion,
    editQuestion,
    discardQuestion,
    approvedCount,
  };
}
