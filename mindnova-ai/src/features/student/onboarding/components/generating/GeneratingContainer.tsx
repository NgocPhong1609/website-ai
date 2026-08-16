"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore"; 

import { GENERATING_STEPS } from "@/src/features/student/onboarding/constants";
import { OrbitAnimation } from "./OrbitAnimation";
import { StepItem } from "./StepItem";
import { LeftFloatingIcons, RightFloatingIcons } from "./FloatingIcons";

// Khai báo kiểu tường minh cho store onboarding
interface IOnboardingStoreExtended {
  formData: {
    goal: string;
    level: string;
    topics: string[];
  };
  setGeneratedPlan?: (plan: unknown) => void;
}

export default function GeneratingContainer() {
  const router = useRouter();
  
  // Ép kiểu tường minh bằng interface thay vì dùng any để tránh bị TypeScript gạch đỏ
  const { formData, setGeneratedPlan } = useOnboardingStore() as unknown as IOnboardingStoreExtended;

  useEffect(() => {
    const generateLearningPath = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";

        const fetchPromise = fetch("/api/student/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            goal: formData.goal,
            level: formData.level,
            topics: formData.topics,
          }),
        });

        const delayPromise = new Promise((resolve) => setTimeout(resolve, 3500));

        const [response] = await Promise.all([fetchPromise, delayPromise]);
        const apiResponse = response as Response;
        const result = await apiResponse.json();

        if (apiResponse.ok && result.status === "success") {
          // Lưu kết quả AI vào store để trang Plan hiển thị
          if (setGeneratedPlan) {
            setGeneratedPlan(result.data);
          }

          router.push("/onboarding/plan");
        } else {
          console.error("Lỗi từ Backend:", result);
          router.push("/");
        }
      } catch (error) {
        console.error("Lỗi mạng hoặc hệ thống:", error);
        router.push("/");
      }
    };

    generateLearningPath();
  }, [formData, router, setGeneratedPlan]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <LeftFloatingIcons />
      <RightFloatingIcons />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-bold text-[#131B2E] leading-tight">
            MindNova AI is creating your study plan…
          </h1>
          <p className="text-sm text-[#84849A] max-w-sm leading-relaxed">
            Our neural network is tailoring content specifically for your goals
            and expertise.
          </p>
        </div>

        <OrbitAnimation />

        <div className="w-full flex flex-col gap-2">
          {GENERATING_STEPS.map((step) => (
            <StepItem key={step.id} label={step.label} status={step.status} />
          ))}
        </div>

        <p className="text-xs text-center text-[#84849A] leading-relaxed max-w-sm">
          MindNova AI uses GPT-4 and custom models to generate your curriculum.{" "}
          <br />
          This usually takes less than 30 seconds.
        </p>
      </div>
    </div>
  );
}