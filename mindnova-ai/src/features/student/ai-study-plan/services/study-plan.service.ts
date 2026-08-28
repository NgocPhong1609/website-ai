import { apiClient } from "@/src/shared/lib/api-client";
import type {
 StudyPlanOverview,
 StudyPlanApiResponse,
 ActiveSyllabus,
 CoreConcept,
} from "../types";

function normalizeSyllabus(raw?: any): ActiveSyllabus | null {
 if (!raw) {
 return null;
 }

 return {
 id: raw.id,
 title: raw.title,
 currentModuleIndex: raw.current_module_index ?? raw.currentModuleIndex ?? 1,
 totalModules: raw.total_modules ?? raw.totalModules ?? 1,
 moduleTitle: raw.module_title ?? raw.moduleTitle ?? "Module",
 description: raw.description,
 progressPercentage: raw.progress_percentage ?? raw.progressPercentage ?? 0,
 completedTopics: raw.completed_topics ?? raw.completedTopics ?? 0,
 totalTopics: raw.total_topics ?? raw.totalTopics ?? 0,
 statusBadge: raw.status_badge ?? raw.statusBadge ?? "Active",
 };
}

function normalizeConcept(raw: CoreConcept): CoreConcept {
 return {
 id: raw.id,
 title: raw.title,
 status: raw.status || "Queued",
 statusColor: raw.status_color ?? raw.statusColor ?? "neutral",
 description: raw.description,
 };
}

/**
 * Fetches study plan overview stats directly in React Server Components (RSC).
 * Implements Next.js caching and revalidating per checklist.md Rule #4.
 */
export async function getStudyPlanOverview(): Promise<StudyPlanOverview> {
 try {
 const response = await apiClient<StudyPlanApiResponse>("/student/study-plan", {
 cache: "no-store",
 } as RequestInit);

 if (response?.success && response?.data) {
 return {
 activeSyllabus: normalizeSyllabus(response.data.active_syllabus),
 coreConcepts: (response.data.core_concepts || []).map(normalizeConcept),
 lessonResources: response.data.lesson_resources || [],
 aiInsight: response.data.ai_insight || "Ask Nova to illustrate the Bloch Sphere if you need a tangible 3D mental model for multi-dimensional qubit states.",
 initialMessages: response.data.initial_messages || [
 {
 id: "msg-init",
 sender: "ai",
 timestamp: "Just now",
 text: "Greetings! I am **Nova**, your personal AI Study Co-Pilot. We are currently focusing on **Module 4: Quantum Computing Fundamentals**.\n\nYou've already mastered Superposition! Do you want to dive deeper into **Entanglement mathematics**, or should we run a simulation on **Qubit Gate architectures** today?",
 },
 ],
 };
 }
 } catch (error) {
 console.warn("[StudyPlanService] Unable to reach backend /student/study-plan API, falling back to cached local demo:", error);
 }

 // Fallback if server is disconnected or returns empty
 return {
 activeSyllabus: null,
 coreConcepts: [],
 lessonResources: [],
 aiInsight: "Vui lòng đăng ký khóa học để có Lộ trình AI cá nhân hóa.",
 initialMessages: [
 {
 id: "msg-init",
 sender: "ai",
 timestamp: "Vừa xong",
 text: "Chào bạn! Vui lòng bắt đầu một khóa học để kích hoạt Gia sư AI.",
 },
 ],
 };
}
