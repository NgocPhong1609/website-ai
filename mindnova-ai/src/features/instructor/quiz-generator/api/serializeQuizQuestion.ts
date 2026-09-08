import type { GeneratedQuestion } from "../types/quizGenerator.types";

export function serializeQuizQuestion(question: GeneratedQuestion | any) {
  const isEssay = question.type === "essay" || question.type === "tu_luan";

  return {
    type: isEssay ? "essay" : "multiple_choice",
    selection_type: isEssay ? undefined : (question.selection_type || "single_choice"),
    difficulty: question.difficulty || "medium",
    content: question.question || question.content || "",
    image_url: question.image_url || null,
    image_r2_key: question.image_r2_key || null,
    explanation: question.explanation || "",
    sample_answer: isEssay ? (question.sample_answer || "") : undefined,
    rubric: isEssay ? (question.rubric || "") : undefined,
    points: parseFloat(question.points) || (isEssay ? 2.5 : 0.5),
    answers: !isEssay
      ? (Array.isArray(question.answers)
        ? question.answers.map((answer: any, index: number) => ({
          content: answer.content || answer.text || "",
          is_correct: Boolean(answer.is_correct),
          image_url: answer.image_url || question.answer_images?.[index]?.url || null,
          image_r2_key: answer.image_r2_key || question.answer_images?.[index]?.r2_key || null,
        }))
        : (Array.isArray(question.options)
          ? question.options.map((option: string, index: number) => ({
            content: option,
            is_correct: question.selection_type === "multiple_choice"
              ? (question.correct_answer_indices || []).includes(index)
              : index === question.correct_answer_index,
            image_url: question.answer_images?.[index]?.url || null,
            image_r2_key: question.answer_images?.[index]?.r2_key || null,
          }))
          : []))
      : undefined,
  };
}
