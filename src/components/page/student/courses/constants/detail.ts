import type { ICourseDetail, IMockQuiz } from "@/src/components/page/student/courses/types";

export const COURSE_DETAIL: ICourseDetail = {
  id: 1,
  title: "Next.js Fullstack",
  level: "Intermediate",
  description:
    "Build modern fullstack apps with Next.js App Router, leveraging Server Components, Route Handlers, and high-performance patterns.",
  nextLesson: "Route Handlers",
  nextLessonId: 202,
  progress: 72,
  avgScore: 85,
  thumbnailGradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
  lessonsLeftTime: "4h 30m left",
  userCourseStatus: "ACTIVE",
  instructor: {
    name: "Dr. Alex Rivers",
    role: "Senior Next.js Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  },
  resources: [
    { id: 1, title: "Project Files (.zip)", type: "zip", url: "#" },
    { id: 2, title: "Official Documentation", type: "link", url: "#" },
    { id: 3, title: "Student Community", type: "chat", url: "#" },
  ],
  modules: [
    {
      id: 1,
      title: "Module 1",
      description: "Introduction",
      isExpanded: true,
      lessons: [
        { id: 101, title: "What is Next.js?", duration: "12:40", status: "completed", videoDurationSeconds: 760, watchedSeconds: 760 },
        { id: 102, title: "App Router Basics", duration: "18:15", status: "completed", videoDurationSeconds: 1095, watchedSeconds: 1095 },
        { id: 103, title: "File-based Routing", duration: "22:05", status: "completed", videoDurationSeconds: 1325, watchedSeconds: 1325 },
      ],
    },
    {
      id: 2,
      title: "Module 2 • In Progress",
      description: "Data Fetching",
      isExpanded: true,
      lessons: [
        { id: 201, title: "Server Components", duration: "15:30", status: "completed", videoDurationSeconds: 930, watchedSeconds: 930 },
        { id: 202, title: "Route Handlers", duration: "25:00", status: "current", videoDurationSeconds: 1500, watchedSeconds: 0, type: "video" },
        { id: 203, title: "Server Actions", duration: "28:45", status: "locked", videoDurationSeconds: 1725, watchedSeconds: 0 },
      ],
    },
    {
      id: 3,
      title: "Module 3",
      description: "Authentication",
      isExpanded: false,
      lessons: [
        { id: 301, title: "Auth.js Setup", duration: "14:20", status: "locked", videoDurationSeconds: 860, watchedSeconds: 0 },
        { id: 302, title: "OAuth Providers", duration: "25:10", status: "locked", videoDurationSeconds: 1510, watchedSeconds: 0 },
      ],
    },
  ],
};

// ─── Mock Quiz Data ────────────────────────────────────────────────────────────

export const MOCK_QUIZ: IMockQuiz = {
  id: 1,
  title: "Route Handlers in Next.js",
  description:
    "Test your knowledge on creating API endpoints and managing request methods in Next.js.",
  durationSeconds: 480, // 8 minutes
  passingScore: 70,
  maxAttempts: 3,
  attemptsUsed: 1,
  deadline: null,
  questions: [
    {
      id: 1,
      question: "Which file convention defines a Route Handler in Next.js App Router?",
      options: [
        { id: "a", text: "api.ts" },
        { id: "b", text: "route.ts" },
        { id: "c", text: "handler.ts" },
        { id: "d", text: "endpoint.ts" },
      ],
      correctOptionId: "b",
      explanation: "In the App Router, Route Handlers are defined in files named `route.ts` (or `route.js`) inside the `app` directory.",
    },
    {
      id: 2,
      question: "How do you export a GET handler in a Route Handler file?",
      options: [
        { id: "a", text: "module.exports.get = () => {}" },
        { id: "b", text: "export default function get() {}" },
        { id: "c", text: "export async function GET(request: Request) {}" },
        { id: "d", text: "export const get = () => {}" },
      ],
      correctOptionId: "c",
      explanation: "Route Handlers export named functions corresponding to HTTP methods (GET, POST, PUT, DELETE, etc.).",
    },
    {
      id: 3,
      question: "What does a Route Handler return to send a JSON response?",
      options: [
        { id: "a", text: "res.json(data)" },
        { id: "b", text: "Response.json(data)" },
        { id: "c", text: "new JsonResponse(data)" },
        { id: "d", text: "JSON.stringify(data)" },
      ],
      correctOptionId: "b",
      explanation: "`Response.json()` is the standard Web API method for returning a JSON response from a Route Handler.",
    },
    {
      id: 4,
      question: "How do you access query parameters in a Route Handler?",
      options: [
        { id: "a", text: "request.params" },
        { id: "b", text: "new URL(request.url).searchParams" },
        { id: "c", text: "request.query" },
        { id: "d", text: "req.query" },
      ],
      correctOptionId: "b",
      explanation: "Use the Web standard `URL` API: `const { searchParams } = new URL(request.url)`.",
    },
    {
      id: 5,
      question: "Route Handlers can coexist with which other Next.js file?",
      options: [
        { id: "a", text: "page.tsx" },
        { id: "b", text: "layout.tsx" },
        { id: "c", text: "middleware.ts" },
        { id: "d", text: "None — they conflict with other segment files" },
      ],
      correctOptionId: "d",
      explanation: "A `route.ts` file cannot exist in the same route segment as a `page.tsx` file. They are mutually exclusive.",
    },
  ],
};
