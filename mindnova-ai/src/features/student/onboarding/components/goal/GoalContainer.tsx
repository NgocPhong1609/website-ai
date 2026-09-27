"use client";

import { useRouter } from "next/navigation";
import { ONBOARDING_GOALS } from "../../constants";
import { useOnboardingHydration } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { OnboardingShell } from "../shared/OnboardingShell";
import { OptionCard, StepActions, StepIntro, StepSkeleton } from "../shared/StepParts";

export default function GoalContainer() {
  const router = useRouter();
  const hydrated = useOnboardingHydration();
  const goalId = useOnboardingStore((s) => s.goalId);
  const selectGoal = useOnboardingStore((s) => s.selectGoal);

  return (
    <OnboardingShell step="goal">
      {!hydrated ? (
        <StepSkeleton cards={6} />
      ) : (
        <>
          <StepIntro
            eyebrow="Bước 1/3"
            title="Mục tiêu học tập của bạn là gì?"
            description="Chọn một mục tiêu chính. Bạn có thể tạo lại lộ trình với mục tiêu khác bất cứ lúc nào."
          />
          <fieldset>
            <legend className="sr-only">Mục tiêu học tập</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ONBOARDING_GOALS.map((goal) => (
                <OptionCard
                  key={goal.id}
                  name="goal"
                  value={goal.id}
                  checked={goalId === goal.id}
                  title={goal.title}
                  description={goal.description}
                  icon={goal.icon}
                  onChange={() => selectGoal(goal.id)}
                />
              ))}
            </div>
          </fieldset>
          <StepActions
            backHref="/onboarding"
            canContinue={goalId !== null}
            hint={goalId ? undefined : "Chọn một mục tiêu để tiếp tục"}
            onContinue={() => router.push("/onboarding/skills")}
          />
        </>
      )}
    </OnboardingShell>
  );
}
