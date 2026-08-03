import { apiClient } from "@/src/shared/lib/api-client";
import type {
  StudyPlanOverview,
  StudyPlanApiResponse,
  ActiveSyllabus,
  CoreConcept,
} from "../types";

function normalizeSyllabus(raw?: ActiveSyllabus): ActiveSyllabus {
  if (!raw) {
    return {
      id: "syl-qc-01",
      title: "Quantum Computing Fundamentals",
      currentModuleIndex: 4,
      totalModules: 8,
      moduleTitle: "Module 4: Quantum Gates & Superposition Circuits",
      description:
        "Master the mathematics and logical architectures of superposition, quantum entanglement, and qubit gate circuits with your interactive real-time AI tutor.",
      progressPercentage: 65,
      completedTopics: 13,
      totalTopics: 20,
      statusBadge: "On Track",
    };
  }

  return {
    id: raw.id || "syl-qc-01",
    title: raw.title || "Quantum Computing Fundamentals",
    currentModuleIndex: raw.current_module_index ?? raw.currentModuleIndex ?? 4,
    totalModules: raw.total_modules ?? raw.totalModules ?? 8,
    moduleTitle: raw.module_title ?? raw.moduleTitle ?? "Module 4: Quantum Gates & Superposition Circuits",
    description:
      raw.description ||
      "Master the mathematics and logical architectures of superposition, quantum entanglement, and qubit gate circuits with your interactive real-time AI tutor.",
    progressPercentage: raw.progress_percentage ?? raw.progressPercentage ?? 65,
    completedTopics: raw.completed_topics ?? raw.completedTopics ?? 13,
    totalTopics: raw.total_topics ?? raw.totalTopics ?? 20,
    statusBadge: raw.status_badge ?? raw.statusBadge ?? "On Track",
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
      next: { revalidate: 60 },
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

  // Fallback demo object if server is temporarily disconnected
  return {
    activeSyllabus: normalizeSyllabus(),
    coreConcepts: [
      {
        id: "concept-1",
        title: "Superposition",
        status: "Mastered",
        statusColor: "teal",
        description: "System existing in multiple theoretical states simultaneously until observed.",
      },
      {
        id: "concept-2",
        title: "Entanglement",
        status: "In Progress",
        statusColor: "amber",
        description: "Interconnected particle correlations remaining linked across physical distances.",
      },
      {
        id: "concept-3",
        title: "Qubits Architecture",
        status: "Queued",
        statusColor: "neutral",
        description: "Basic architectural unit of advanced quantum mathematical information.",
      },
    ],
    lessonResources: [
      {
        id: "res-pdf",
        type: "pdf",
        title: "Superposition_Notes.pdf",
        meta: "PDF Guide • 2.4 MB",
        url: "#resource-pdf",
      },
      {
        id: "res-video",
        type: "video",
        title: "Visualizing Qubits.mp4",
        meta: "Video Lesson • 14:20",
        url: "#resource-video",
      },
    ],
    aiInsight: "Ask Nova to illustrate the Bloch Sphere if you need a tangible 3D mental model for multi-dimensional qubit states.",
    initialMessages: [
      {
        id: "msg-init",
        sender: "ai",
        timestamp: "Just now",
        text: "Greetings! I am **Nova**, your personal AI Study Co-Pilot. We are currently focusing on **Module 4: Quantum Computing Fundamentals**.\n\nYou've already mastered Superposition! Do you want to dive deeper into **Entanglement mathematics**, or should we run a simulation on **Qubit Gate architectures** today?",
      },
    ],
  };
}
