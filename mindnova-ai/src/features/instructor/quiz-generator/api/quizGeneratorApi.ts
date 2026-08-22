import { axiosClient } from "@/src/shared/lib/axios";
import { QuizConfig, GeneratedQuestion, QuizSummary, QuizAttachmentPayload } from "../types/quizGenerator.types";

export const quizGeneratorApi = {
  // Generate quiz questions via AI
  generateQuiz: async (config: QuizConfig) => {
    const payload = {
      source_type: config.source_type,
      course_id: config.source_type === "course" && config.course_id ? Number(config.course_id) : undefined,
      content: config.source_type === "content" ? config.source_content : undefined,
      topic: config.source_type === "topic" ? config.topic : undefined,
      difficulty: config.difficulty,
      total_questions: config.total_questions,
      multiple_choice_count: config.multiple_choice_count,
      essay_count: config.essay_count,
      time_limit_minutes: config.time_limit_minutes,
      passing_score: config.passing_score,
    };

    const res = await axiosClient.post("/api/instructor/ai-quiz/generate", payload, {
      timeout: 120000,
    });
    return res.data;
  },

  // Regenerate a single question
  regenerateSingleQuestion: async (type: "multiple_choice" | "essay", difficulty: string, context: string) => {
    const res = await axiosClient.post("/api/instructor/ai-quiz/regenerate-question", {
      type,
      difficulty,
      context,
    }, {
      timeout: 60000,
    });
    return res.data;
  },

  // Save standalone quiz
  saveQuiz: async (quizData: {
    title: string;
    description: string;
    source_type: string;
    source_content: string;
    course_id?: number | null;
    difficulty: string;
    time_limit_minutes: number;
    passing_score: number;
    status: "draft" | "published";
    questions: GeneratedQuestion[];
  }) => {
    const payload = {
      ...quizData,
      questions: quizData.questions.map((q) => ({
        type: q.type,
        difficulty: q.difficulty,
        content: q.question,
        explanation: q.explanation,
        sample_answer: q.type === "essay" ? q.sample_answer : undefined,
        rubric: q.type === "essay" ? q.rubric : undefined,
        points: q.points,
        answers: q.type === "multiple_choice"
          ? q.options.map((opt, idx) => ({
              content: opt,
              is_correct: idx === q.correct_answer_index,
            }))
          : undefined,
      })),
    };

    const res = await axiosClient.post("/api/instructor/ai-quiz/store", payload);
    return res.data;
  },

  // Get list of instructor quizzes
  getQuizzes: async (): Promise<{ success: boolean; data: QuizSummary[] }> => {
    const res = await axiosClient.get("/api/instructor/ai-quiz");
    return res.data;
  },

  // Get quiz details
  getQuizById: async (quizId: number) => {
    const res = await axiosClient.get(`/api/instructor/ai-quiz/${quizId}`);
    return res.data?.data || res.data;
  },

  // Delete quiz (supports optional force parameter to un-attach attached quizzes)
  deleteQuiz: async (quizId: number, force: boolean = false) => {
    const res = await axiosClient.delete(`/api/instructor/ai-quiz/${quizId}`, {
      params: force ? { force: 1 } : {},
    });
    return res.data;
  },

  // Attach quiz to course
  attachQuiz: async (quizId: number, attachment: QuizAttachmentPayload) => {
    const res = await axiosClient.post(`/api/instructor/ai-quiz/${quizId}/attach`, attachment);
    return res.data;
  },

  // Get instructor courses for attachment dropdown
  getInstructorCourses: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await axiosClient.get("/api/instructor/courses?per_page=100");
    const raw = res.data;
    let list: any[] = [];
    if (Array.isArray(raw?.data)) {
      list = raw.data;
    } else if (Array.isArray(raw?.data?.data)) {
      list = raw.data.data;
    } else if (Array.isArray(raw)) {
      list = raw;
    }
    return { success: true, data: list };
  },

  // Get full course details with modules and lessons
  getCourseDetails: async (courseId: number) => {
    const res = await axiosClient.get(`/api/instructor/courses/${courseId}`);
    return res.data?.data || res.data;
  },
};
