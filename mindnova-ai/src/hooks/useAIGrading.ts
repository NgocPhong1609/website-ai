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

    console.log("[Backend Simulation] AI Grader invoked.");
    console.log("Rubric Context:", instructorRubric);
    console.log("User Content Length:", userSubmission.length);

    // Simulate LLM processing time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulated Structured JSON output from LLM based on comparison
    // In production, the prompt enforces strict JSON return schema
    const mockLLMResponse: IAIGradingResult = {
      score: Math.floor(maxScore * 0.85), // Example 85%
      maxScore,
      detailedErrors: [
        {
          lineOrParagraph: "Paragraph 2, Line 1",
          issue: "Lacks sufficient depth in explaining the architectural tradeoffs. The rubric requires specific examples of scalability.",
        },
        {
          lineOrParagraph: "Conclusion",
          issue: "Did not summarize the core thesis clearly as required by the assignment guidelines.",
        }
      ],
      correctionHints: [
        "Try integrating a real-world case study to support your claims in the second section.",
        "Ensure your conclusion directly maps back to the introduction."
      ],
      overallFeedback: "Solid effort overall. The foundational concepts are correct, but the application lacks the depth expected for a perfect score. Review the hints and try adding more concrete examples.",
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
