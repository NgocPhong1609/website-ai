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
        image_url: "https://example.test/question.png",
        image_r2_key: null,
        options: ["A", "B", "C"],
        correct_answer_index: 0,
        correct_answer_indices: [0, 1],
        answer_images: [
          { url: "https://example.test/a.png", r2_key: null },
          { url: null, r2_key: null },
          { url: null, r2_key: null },
        ],
        explanation: "",
        points: 10,
        reviewStatus: "edited",
    });

    expect(payload).toEqual(expect.objectContaining({
      selection_type: "multiple_choice",
      image_url: "https://example.test/question.png",
      answers: [
        expect.objectContaining({ content: "A", is_correct: true, image_url: "https://example.test/a.png" }),
        expect.objectContaining({ content: "B", is_correct: true }),
        expect.objectContaining({ content: "C", is_correct: false }),
      ],
    }));
  });
});
