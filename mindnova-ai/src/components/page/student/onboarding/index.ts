// ─── Onboarding Feature — Public API ──────────────────────────────────────────
// Import from this barrel instead of deep paths inside the feature

// Components
export { default as WelcomeContainer } from "./welcome/WelcomeContainer";
export { default as GoalContainer } from "./goal/GoalContainer";
export { default as SkillContainer } from "./skills/SkillContainer";
export { default as GeneratingContainer } from "./generating/GeneratingContainer";
export { default as TopicsContainer } from "./topics/TopicsContainer";
export { default as PlanContainer } from "./plan/PlanContainer";

// AI Assistant & Auth features for Guest Actor
export { FloatingAIChatbot } from "./ai-assistant/FloatingAIChatbot";
export { GuestAuthModal } from "./auth/GuestAuthModal";

// Hooks
export { useOnboarding } from "./hooks";

// Stores
export { useOnboardingStore } from "./stores";

// Constants
export * from "./constants";

// Types
export type * from "./types";
