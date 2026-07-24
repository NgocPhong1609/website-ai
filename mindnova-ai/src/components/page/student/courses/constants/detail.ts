import type { ICourseDetail } from "@/src/components/page/student/courses/types";

export const COURSE_DETAIL: ICourseDetail = {
  id: 1,
  title: "Next.js Fullstack",
  level: "Intermediate",
  description:
    "Build modern fullstack apps with Next.js App Router, leveraging Server Components, Route Handlers, and high-performance patterns.",
  nextLesson: "Route Handlers",
  nextLessonId: 202,
  progress: 72,
  thumbnailGradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
  lessonsLeftTime: "4h 30m left",
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
        { id: 101, title: "What is Next.js?", duration: "12:40", status: "completed" },
        { id: 102, title: "App Router Basics", duration: "18:15", status: "completed" },
        { id: 103, title: "File-based Routing", duration: "22:05", status: "completed" },
      ],
    },
    {
      id: 2,
      title: "Module 2 • In Progress",
      description: "Data Fetching",
      isExpanded: true,
      lessons: [
        { id: 201, title: "Server Components", duration: "15:30", status: "completed" },
        { id: 202, title: "Route Handlers", duration: "15:30", status: "current" },
        { id: 203, title: "Server Actions", duration: "28:45", status: "locked" },
      ],
    },
    {
      id: 3,
      title: "Module 3",
      description: "Authentication",
      isExpanded: false,
      lessons: [
        { id: 301, title: "Auth.js Setup", duration: "14:20", status: "locked" },
        { id: 302, title: "OAuth Providers", duration: "25:10", status: "locked" },
      ],
    },
  ],
};
