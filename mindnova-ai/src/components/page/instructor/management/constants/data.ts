import type { Course } from "../types";

// ─── Mock Data — Course Management ────────────────────────────────────────────
// Replace with real API calls in production.

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Cơ bản về Generative AI",
    thumbnail: "/thumbnails/generative-ai.jpg",
    status: "published",
    durationHours: 12,
    totalLessons: 45,
  },
  {
    id: "2",
    title: "Deep Learning Nâng Cao",
    thumbnail: "/thumbnails/deep-learning.jpg",
    status: "draft",
    durationHours: 24,
    totalLessons: 82,
  },
  {
    id: "3",
    title: "Nghệ thuật Prompt Engineering",
    thumbnail: "/thumbnails/prompt.jpg",
    status: "published",
    durationHours: 8,
    totalLessons: 30,
  },
  {
    id: "4",
    title: "Python cho Data Science",
    thumbnail: "/thumbnails/python-ds.jpg",
    status: "published",
    durationHours: 30,
    totalLessons: 120,
  },
  {
    id: "5",
    title: "Đạo đức & Bảo mật trong AI",
    thumbnail: "/thumbnails/ethics-ai.jpg",
    status: "draft",
    durationHours: 10,
    totalLessons: 25,
  },
];

export const TOTAL_COURSES = 24;
export const ACTIVE_COURSES = 18;
export const DRAFT_COURSES = 6;

export const MONTHLY_REVENUE = "42,5M ₫";
export const REVENUE_GROWTH = "+12.5%";
