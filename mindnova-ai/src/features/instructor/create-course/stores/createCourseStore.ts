// ─── Create Course — Zustand Store ────────────────────────────────────────────
// Manages all draft state across Step 1, 2, 3.
// Persists to sessionStorage so data survives page reloads.
// No API calls happen here — only in-memory draft management.

import { create } from "zustand";
import type {
  StepKey,
  CourseBasicInfo,
  DraftModule,
  DraftLesson,
  DraftLessonType,
  Step3Data,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

const SESSION_KEY = "mindnova_course_draft";

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_COURSE_INFO: CourseBasicInfo = {
  title: "",
  description: "",
  field: "",
  difficulty: "beginner",
  thumbnailFile: null,
  thumbnailPreview: null,
};

const INITIAL_SETTINGS: Step3Data = {
  isDraft: false,
  isPublic: true,
  allowRating: true,
  currency: "VND",
  basePrice: "2.500.000",
  salePrice: "1.450.000",
};

// ─── Serialization ────────────────────────────────────────────────────────────
// thumbnailFile (File object) cannot be serialized, so we exclude it.
// pendingVideos (Map<string, File>) also cannot be serialized.

interface SerializableState {
  step: StepKey;
  courseInfo: Omit<CourseBasicInfo, "thumbnailFile">;
  modules: DraftModule[];
  settings: Step3Data;
}

function saveToSession(state: ICreateCourseState): void {
  try {
    const serializable: SerializableState = {
      step: state.step,
      courseInfo: {
        title: state.courseInfo.title,
        description: state.courseInfo.description,
        field: state.courseInfo.field,
        difficulty: state.courseInfo.difficulty,
        thumbnailPreview: state.courseInfo.thumbnailPreview,
      },
      modules: state.modules,
      settings: state.settings,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(serializable));
  } catch {
    // sessionStorage may be full or unavailable — silently ignore
  }
}

function loadFromSession(): Partial<ICreateCourseState> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: SerializableState = JSON.parse(raw);
    return {
      step: parsed.step,
      courseInfo: {
        ...parsed.courseInfo,
        thumbnailFile: null, // Cannot restore File from session
        thumbnailPreview: null, // Clear preview as well since we need the File object to upload
      },
      modules: parsed.modules,
      settings: parsed.settings,
    };
  } catch {
    return null;
  }
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ICreateCourseState {
  // State
  step: StepKey;
  courseInfo: CourseBasicInfo;
  modules: DraftModule[];
  settings: Step3Data;

  // Step navigation
  setStep: (step: StepKey) => void;
  goNext: () => void;
  goBack: () => void;

  // Course info (Step 1)
  setCourseInfo: <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => void;

  // Module CRUD (Step 2)
  setModules: (modules: DraftModule[]) => void;
  addModule: (title: string, description: string) => void;
  updateModule: (id: string, updates: Partial<Pick<DraftModule, "title" | "description">>) => void;
  deleteModule: (id: string) => void;
  reorderModules: (modules: DraftModule[]) => void;
  toggleModuleExpand: (id: string) => void;

  // Lesson CRUD (Step 2)
  addLesson: (moduleId: string, type: DraftLessonType) => void;
  updateLesson: (moduleId: string, lessonId: string, updates: Partial<DraftLesson>) => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;
  reorderLessons: (moduleId: string, lessons: DraftLesson[]) => void;

  // AI suggestion actions
  acceptAiSuggestion: (moduleId: string) => void;
  dismissAiSuggestion: (moduleId: string) => void;

  // Settings (Step 3)
  setSettings: <K extends keyof Step3Data>(key: K, value: Step3Data[K]) => void;

  // Reset
  resetDraft: () => void;

  // Hydrate from sessionStorage
  hydrate: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCreateCourseStore = create<ICreateCourseState>((set, get) => ({
  step: 1,
  courseInfo: { ...INITIAL_COURSE_INFO },
  modules: [],
  settings: { ...INITIAL_SETTINGS },

  // ── Step navigation ─────────────────────────────────────────────────────────

  setStep: (step) => {
    set({ step });
    saveToSession(get());
  },

  goNext: () => {
    const { step } = get();
    if (step < 3) {
      set({ step: (step + 1) as StepKey });
      saveToSession(get());
    }
  },

  goBack: () => {
    const { step } = get();
    if (step > 1) {
      set({ step: (step - 1) as StepKey });
      saveToSession(get());
    }
  },

  // ── Course Info ─────────────────────────────────────────────────────────────

  setCourseInfo: (key, value) => {
    set((state) => ({
      courseInfo: { ...state.courseInfo, [key]: value },
    }));
    saveToSession(get());
  },

  // ── Module CRUD ─────────────────────────────────────────────────────────────

  setModules: (modules) => {
    set({ modules });
    saveToSession(get());
  },

  addModule: (title, description) => {
    set((state) => {
      const newModule: DraftModule = {
        id: uid(),
        title,
        description,
        order: state.modules.length + 1,
        expanded: true,
        lessons: [],
        showAiSuggestion: state.modules.length >= 1,
      };
      return { modules: [...state.modules, newModule] };
    });
    saveToSession(get());
  },

  updateModule: (id, updates) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, ...updates } : m,
      ),
    }));
    saveToSession(get());
  },

  deleteModule: (id) => {
    set((state) => ({
      modules: state.modules
        .filter((m) => m.id !== id)
        .map((m, i) => ({ ...m, order: i + 1 })),
    }));
    saveToSession(get());
  },

  reorderModules: (modules) => {
    set({ modules: modules.map((m, i) => ({ ...m, order: i + 1 })) });
    saveToSession(get());
  },

  toggleModuleExpand: (id) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, expanded: !m.expanded } : m,
      ),
    }));
    saveToSession(get());
  },

  // ── Lesson CRUD ─────────────────────────────────────────────────────────────

  addLesson: (moduleId, type) => {
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id !== moduleId) return m;
        const newLesson: DraftLesson = {
          id: uid(),
          title: `Bài ${m.lessons.length + 1} - ${
            type === "video"
              ? "Video bài giảng"
              : type === "quiz"
                ? "Bài kiểm tra"
                : "Tài liệu đọc"
          }`,
          type,
          order: m.lessons.length + 1,
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }),
    }));
    saveToSession(get());
  },

  updateLesson: (moduleId, lessonId, updates) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l,
              ),
            }
          : m,
      ),
    }));
    saveToSession(get());
  },

  deleteLesson: (moduleId, lessonId) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons
                .filter((l) => l.id !== lessonId)
                .map((l, i) => ({ ...l, order: i + 1 })),
            }
          : m,
      ),
    }));
    saveToSession(get());
  },

  reorderLessons: (moduleId, lessons) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: lessons.map((l, i) => ({ ...l, order: i + 1 })) }
          : m,
      ),
    }));
    saveToSession(get());
  },

  // ── AI Suggestions ──────────────────────────────────────────────────────────

  acceptAiSuggestion: (moduleId) => {
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id !== moduleId) return m;
        const aiLessons: DraftLesson[] = [
          { id: uid(), title: "Giới thiệu tổng quan", type: "video", order: m.lessons.length + 1 },
          { id: uid(), title: "Bài tập thực hành", type: "quiz", order: m.lessons.length + 2 },
          { id: uid(), title: "Tài liệu tham khảo", type: "document", order: m.lessons.length + 3 },
        ];
        return {
          ...m,
          lessons: [...m.lessons, ...aiLessons],
          showAiSuggestion: false,
        };
      }),
    }));
    saveToSession(get());
  },

  dismissAiSuggestion: (moduleId) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId ? { ...m, showAiSuggestion: false } : m,
      ),
    }));
    saveToSession(get());
  },

  // ── Settings ────────────────────────────────────────────────────────────────

  setSettings: (key, value) => {
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }));
    saveToSession(get());
  },

  // ── Reset ───────────────────────────────────────────────────────────────────

  resetDraft: () => {
    set({
      step: 1,
      courseInfo: { ...INITIAL_COURSE_INFO },
      modules: [],
      settings: { ...INITIAL_SETTINGS },
    });
    clearSession();
  },

  // ── Hydrate ─────────────────────────────────────────────────────────────────

  hydrate: () => {
    const saved = loadFromSession();
    if (saved) {
      set(saved);
    }
  },
}));
