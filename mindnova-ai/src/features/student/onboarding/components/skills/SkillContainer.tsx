"use client";

import { useRouter } from "next/navigation";
import { ONBOARDING_LEVELS } from "../../constants";
import { useOnboardingSummary, useStepGuard } from "../../hooks";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { OnboardingShell } from "../shared/OnboardingShell";
import { OptionCard, StepActions, StepIntro, StepSkeleton } from "../shared/StepParts";

export default function SkillContainer() {
  const router = useRouter();
  const ready = useStepGuard("skills");
  const { goal } = useOnboardingSummary();
  const levelId = useOnboardingStore((s) => s.levelId);
  const selectLevel = useOnboardingStore((s) => s.selectLevel);

  return (
    <OnboardingShell step="skills">
      {!ready ? (
        <StepSkeleton />
      ) : (
        <>
          <StepIntro
            eyebrow="Bước 2/3"
            title="Trình độ hiện tại của bạn?"
            description={`AI sẽ điều chỉnh độ khó của lộ trình "${goal?.title}" cho phù hợp, bỏ qua phần bạn đã vững.`}
          />
          <fieldset>
            <legend className="sr-only">Trình độ hiện tại</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ONBOARDING_LEVELS.map((level) => (
                <OptionCard
                  key={level.id}
                  name="level"
                  value={level.id}
                  checked={levelId === level.id}
                  title={level.title}
                  description={level.description}
                  icon={level.icon}
                  onChange={() => selectLevel(level.id)}
                />
              ))}
            </div>
          </fieldset>
          <StepActions
            backHref="/onboarding/goal"
            canContinue={levelId !== null}
            hint={levelId ? undefined : "Chọn trình độ để tiếp tục"}
            onContinue={() => router.push("/onboarding/topics")}
          />
        </>
      )}
    </OnboardingShell>
  );
}
