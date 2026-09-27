import Button from "@shared/components/ui/Button";
import Image from "next/image";
import FeatureCard from "./FeatureCard";
import type { IFeature } from "@/src/features/student/onboarding/types";
import { memo } from "react";

interface HeroSectionLeftProps {
 features: IFeature[];
 onGetStarted: () => void;
 onExplore: () => void;
}

export default memo(function HeroSectionLeft({
 features,
 onGetStarted,
 onExplore,
}: HeroSectionLeftProps) {
 return (
 <div className="w-145 flex flex-col items-start gap-4.5">
 <div className="min-w-45.25 flex items-center justify-center gap-2 p-2 rounded-full bg-blue-500/10">
 <Image
 src="/icons/gemini.svg"
 alt=""
 aria-hidden="true"
 width={22}
 height={22}
 />
 <span className="text-xs text-primary">Học tập cùng AI</span>
 </div>
 <h1 className="text-3xl sm:text-[48px] font-bold leading-tight">
 Chào mừng đến với <span className="text-blue-500">MindNova AI</span>
 </h1>
 <p className="text-base sm:text-lg max-w-120 text-slate-600">
 Trả lời vài câu hỏi ngắn để AI thiết kế lộ trình học tập phù hợp với mục tiêu
 và trình độ của bạn.
 </p>
 <div className="mt-5 max-w-112.25 w-full flex flex-col sm:flex-row gap-3">
 <Button
 onClick={onGetStarted}
 className="sm:max-w-60.5 w-full py-4 rounded-xl text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
 >
 Bắt đầu
 </Button>
 <Button
 onClick={onExplore}
 className="sm:max-w-47.75 w-full py-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
 >
 <div className="flex items-center gap-2">
 <span className="text-[14px] text-slate-900">Khám phá nền tảng</span>
 <Image
 src="/icons/arrow.svg"
 alt=""
 aria-hidden="true"
 width={12}
 height={12}
 />
 </div>
 </Button>
 </div>
 <div className="grid grid-cols-3 gap-2 max-w-139 w-full">
 {features.map((feature) => (
 <FeatureCard
 key={feature.id}
 icon={feature.icon}
 title={feature.title}
 description={feature.description}
 />
 ))}
 </div>
 </div>
 );
});
