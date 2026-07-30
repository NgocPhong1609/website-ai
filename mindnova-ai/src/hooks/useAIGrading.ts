import { useState, useCallback } from "react";
import type { IAIGradingResult } from "@/src/types/student";

interface UseAIGradingOptions {
  instructorRubric: string;
  maxScore: number;
}

export function useAIGrading({ instructorRubric, maxScore }: UseAIGradingOptions) {
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<IAIGradingResult | null>(null);

  const gradeSubmission = useCallback(async (userSubmission: string) => {
    setIsGrading(true);
    setGradingResult(null);

    console.log("[Backend Simulation] AI Grader invoked against custom Instructor Rubrics.");
    console.log("Rubric Context:", instructorRubric);
    console.log("User Content Length:", userSubmission.length);

    // Simulate LLM Processing latency
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Simulated Structured JSON output from LLM based on precise rubric comparison
    const mockLLMResponse: IAIGradingResult = {
      score: Math.floor(maxScore * 0.88), // 88/100
      maxScore,
      detailedErrors: [
        {
          lineOrParagraph: "Line 14: Route Handler Verification",
          issue: "Potential Promise rejection: missing explicit error handling around JSON payload extraction in Edge runtime.",
        },
        {
          lineOrParagraph: "Line 28: HMAC Cryptographic Validation",
          issue: "Used timing-unsafe string comparison (===) for SHA-256 signatures instead of crypto.timingSafeEqual(), exposing potential timing side-channel attacks.",
        },
        {
          lineOrParagraph: "Section 3: Architectural Tradeoff Analysis",
          issue: "Lacks sufficient depth in comparing Redis in-memory cache TTLs against database replica invalidations as required by rubric clause #2.",
        }
      ],
      correctionHints: [
        "💡 Line 28 Actionable Hint: Convert both hex signature strings into Buffer objects and verify via crypto.timingSafeEqual(bufA, bufB) to harden against timing side-channels.",
        "💡 Line 14 Hint: Wrap await req.json() inside a try/catch block and return a standard 400 Bad Request JSON payload upon parsing failure.",
        "💡 Architectural Tip: Include an explicit memory evict policy (LRU vs LFU) diagram when describing Redis cache fallback patterns."
      ],
      overallFeedback: "Exceptional code quality and strong domain mastery! The core API endpoints conform cleanly to Next.js 15 native Request/Response patterns. Addressing the signature verification timing-safe hint will elevate this project to production enterprise standards.",
    };

    setGradingResult(mockLLMResponse);
    setIsGrading(false);
  }, [instructorRubric, maxScore]);

  const resetGrading = useCallback(() => {
    setGradingResult(null);
  }, []);

  return {
    isGrading,
    gradingResult,
    gradeSubmission,
    resetGrading,
  };
}
