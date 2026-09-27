import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPlanPayload, missingPrerequisite } from "../hooks";
import { useOnboardingStore } from "../stores/onboardingStore";
import { MAX_TOPICS, ONBOARDING_GOALS } from "../constants";
import type { GeneratedPlan } from "../types";

const { push, replace, generatePlan } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  generatePlan: vi.fn(),
}));

vi.mock("next/navigation", () => {
  const router = { push, replace, back: vi.fn(), refresh: vi.fn() };
  return { useRouter: () => router };
});
vi.mock("../api", () => ({ generatePlan, useLessonAnalysis: vi.fn() }));
vi.mock("@/src/features/student/layout/components/SidebarBrand", () => ({ SidebarBrand: () => null }));

const PLAN: GeneratedPlan = {
  profile: { goal: "Lập trình viên Frontend", level: "Mới bắt đầu", time_available: "1–2 giờ/ngày", topics: ["React"], est_time: "3 tháng" },
  learning_path: [
    { phase: 1, title: "Nền tảng", description: "", duration: "3 tuần", status: "unlocked", lessons: [{ name: "JSX", duration: "2 ngày" }], courses: [] },
  ],
  source: "ai",
};

function answer() {
  const s = useOnboardingStore.getState();
  s.selectGoal("frontend");
  s.selectLevel("beginner");
  s.selectTime("1-2h");
}

beforeEach(() => {
  sessionStorage.clear();
  useOnboardingStore.getState().reset();
  useOnboardingStore.setState({ hasHydrated: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  push.mockReset();
  replace.mockReset();
  generatePlan.mockReset();
});

describe("onboarding store", () => {
  it("clears topics and the plan when the goal changes", () => {
    answer();
    useOnboardingStore.getState().toggleTopic("React");
    useOnboardingStore.getState().setPlan(PLAN);

    useOnboardingStore.getState().selectGoal("backend");

    const state = useOnboardingStore.getState();
    expect(state.topics).toEqual([]);
    expect(state.plan).toBeNull();
    expect(state.levelId).toBe("beginner");
  });

  it("caps the number of topics", () => {
    const topics = ONBOARDING_GOALS[0].topics;
    topics.forEach((t) => useOnboardingStore.getState().toggleTopic(t));
    expect(useOnboardingStore.getState().topics).toHaveLength(MAX_TOPICS);

    useOnboardingStore.getState().toggleTopic(topics[0]);
    expect(useOnboardingStore.getState().topics).not.toContain(topics[0]);
  });
});

describe("step prerequisites", () => {
  const empty = { goalId: null, levelId: null, timeId: null, topics: [], hasPlan: false };

  it("sends learners back to the first unanswered question", () => {
    expect(missingPrerequisite("skills", empty)).toBe("/onboarding/goal");
    expect(missingPrerequisite("topics", { ...empty, goalId: "frontend" })).toBe("/onboarding/skills");
    expect(missingPrerequisite("generating", { ...empty, goalId: "frontend", levelId: "beginner" })).toBe("/onboarding/topics");
    expect(missingPrerequisite("plan", { ...empty, goalId: "frontend", levelId: "beginner", timeId: "30m" })).toBe("/onboarding/generating");
    expect(missingPrerequisite("plan", { ...empty, goalId: "frontend", levelId: "beginner", timeId: "30m", hasPlan: true })).toBeNull();
  });

  it("builds the API payload from Vietnamese labels", () => {
    answer();
    useOnboardingStore.getState().toggleTopic("React");
    expect(buildPlanPayload(useOnboardingStore.getState())).toEqual({
      goal: "Lập trình viên Frontend",
      currentLevel: "Mới bắt đầu",
      timeAvailable: "1–2 giờ/ngày",
      topics: ["React"],
    });
  });
});

describe("GeneratingContainer", () => {
  it("generates once, shows a recoverable error and retries", async () => {
    const { default: GeneratingContainer } = await import("../components/generating/GeneratingContainer");
    vi.useFakeTimers();
    answer();
    generatePlan
      .mockRejectedValueOnce({ response: { status: 502, data: "<html>Bad Gateway</html>" } })
      .mockResolvedValueOnce(PLAN);

    render(<GeneratingContainer />);
    await act(async () => { await vi.advanceTimersByTimeAsync(1500); });

    expect(generatePlan).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert").textContent).toMatch(/Hệ thống tạm thời/);
    expect(replace).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1500); });

    expect(generatePlan).toHaveBeenCalledTimes(2);
    expect(useOnboardingStore.getState().plan).toEqual(PLAN);
    expect(replace).toHaveBeenCalledWith("/onboarding/plan");
  });

  it("redirects to the missing question instead of calling the API", async () => {
    const { default: GeneratingContainer } = await import("../components/generating/GeneratingContainer");
    render(<GeneratingContainer />);
    await act(async () => {});

    expect(replace).toHaveBeenCalledWith("/onboarding/goal");
    expect(generatePlan).not.toHaveBeenCalled();
  });
});

describe("TopicsContainer", () => {
  it("requires a daily time before generating and disables extra topics", async () => {
    const { default: TopicsContainer } = await import("../components/topics/TopicsContainer");
    const s = useOnboardingStore.getState();
    s.selectGoal("frontend");
    s.selectLevel("beginner");

    render(<TopicsContainer />);
    const generate = screen.getByRole("button", { name: "Tạo lộ trình" });
    expect(generate).toBeDisabled();

    ONBOARDING_GOALS[0].topics.slice(0, MAX_TOPICS).forEach((topic) => fireEvent.click(screen.getByLabelText(topic)));
    expect(screen.getByLabelText(ONBOARDING_GOALS[0].topics[MAX_TOPICS])).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/1–2 giờ\/ngày/));
    expect(generate).toBeEnabled();
    fireEvent.click(generate);
    expect(push).toHaveBeenCalledWith("/onboarding/generating");
  });
});
