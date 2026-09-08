import { describe, expect, it } from "vitest";
import { serializeQuizQuestion } from "../serializeQuizQuestion";

describe("quizGeneratorApi", () => {
  it("serializes every selected correct answer", async () => {
    const payload = serializeQuizQuestion({
        id: "q1",
        type: "multiple_choice",
        selection_type: "multiple_choice",
        difficulty: "medium",
        question: "Select all",
        options: ["A", "B", "C"],
        correct_answer_index: 0,
        correct_answer_indices: [0, 1],
        explanation: "",
        points: 10,
        reviewStatus: "edited",
    });

    expect(payload).toEqual(expect.objectContaining({
      selection_type: "multiple_choice",
      answers: [
        { content: "A", is_correct: true },
        { content: "B", is_correct: true },
        { content: "C", is_correct: false },
      ],
    }));
  });
});
