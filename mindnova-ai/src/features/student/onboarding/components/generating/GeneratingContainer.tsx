"use client";

import { getErrorMessage, readApiResponse } from "@/src/shared/lib/user-error";
import { useEffect, useState } from "react";
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
 currentLevel: string;
 timeAvailable: string;
 };
 setGeneratedPlan?: (plan: unknown) => void;
}

export default function GeneratingContainer() {
 const router = useRouter();
 const [error, setError] = useState<string | null>(null);
 const [attempt, setAttempt] = useState(0);
 
 // Ép kiểu tường minh bằng interface thay vì dùng any để tránh bị TypeScript gạch đỏ
 const { formData, setGeneratedPlan } = useOnboardingStore() as unknown as IOnboardingStoreExtended;

 useEffect(() => {
 const generateLearningPath = async () => {
 setError(null);
 try {
 const token = localStorage.getItem("accessToken") || "";

 const fetchPromise = fetch("/api/student/onboarding", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Accept": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({
 goal: formData.goal,
 currentLevel: formData.currentLevel,
 timeAvailable: formData.timeAvailable,
 }),
 });

 const delayPromise = new Promise((resolve) => setTimeout(resolve, 3500));

 const [response] = await Promise.all([fetchPromise, delayPromise]);
 const apiResponse = response as Response;
 const result = await readApiResponse(apiResponse, "Không thể tạo lộ trình học. Vui lòng thử lại.");

 if (apiResponse.ok && result) {
 // Lưu kết quả AI vào store để trang Plan hiển thị
 if (setGeneratedPlan) {
 setGeneratedPlan(result); // result contain 'phases' directly
 }

 router.push("/onboarding/plan");
 } else {
 setError(getErrorMessage(result, "Không thể tạo lộ trình học. Vui lòng thử lại."));
 }
 } catch (error) {
 console.error("Lỗi mạng hoặc hệ thống:", error);
 setError(getErrorMessage(error, "Không thể tạo lộ trình học. Vui lòng thử lại."));
 }
 };

 generateLearningPath();
 }, [formData, router, setGeneratedPlan, attempt]);

 if (error) return (
   <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
     <h1 className="text-xl font-semibold">Chưa thể tạo lộ trình học</h1>
     <p role="alert" className="max-w-md text-sm text-rose-700">{error}</p>
     <button type="button" className="rounded-lg bg-blue-600 px-5 py-2 text-white" onClick={() => setAttempt(value => value + 1)}>Thử lại</button>
     <button type="button" className="text-sm underline" onClick={() => router.back()}>Quay lại</button>
   </div>
 );

 return (
 <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
 <LeftFloatingIcons />
 <RightFloatingIcons />

 <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
 <div className="flex flex-col items-center gap-3 text-center">
 <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight">
 AI đang thiết kế lộ trình...
 </h1>
 <p className="text-sm text-[#64748B] max-w-sm leading-relaxed">
 Hệ thống đang cá nhân hóa nội dung học tập theo mục tiêu và thời gian rảnh của bạn.
 </p>
 </div>

 <OrbitAnimation />

 <div className="w-full flex flex-col gap-2">
 {GENERATING_STEPS.map((step) => (
 <StepItem key={step.id} label={step.label} status={step.status} />
 ))}
 </div>

 <p className="text-xs text-center text-[#64748B] leading-relaxed max-w-sm">
 MindNova AI uses GPT-4 and custom models to generate your curriculum.{" "}
 <br />
 This usually takes less than 30 seconds.
 </p>
 </div>
 </div>
 );
}