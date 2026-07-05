// ─── Onboarding Feature — Public API ──────────────────────────────────────────
// Import from this barrel instead of deep paths inside the feature

// Components
export { default as WelcomeContainer } from "./components/welcome/WelcomeContainer";
export { default as GoalContainer } from "./components/goal/GoalContainer";
export { default as SkillContainer } from "./components/skills/SkillContainer";
export { default as GeneratingContainer } from "./components/generating/GeneratingContainer";
export { default as TopicsContainer } from "./components/topics/TopicsContainer";

// Hooks
export { useOnboarding } from "./hooks";

// Stores
export { useOnboardingStore } from "./stores";

// Constants
export * from "./constants";

// Types
export type * from "./types";
