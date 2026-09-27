import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { IGoal } from "@/src/features/student/onboarding/types";

interface GoalCardProps extends Omit<IGoal, "id"> {
 isActive?: boolean;
 onClick?: () => void;
}

export default function GoalCard({
 icon,
 title,
 description,
 isActive = false,
 onClick,
}: GoalCardProps) {
 return (
 <article
 role="button"
 tabIndex={0}
 onClick={onClick}
 onKeyDown={(e) => e.key === "Enter" && onClick?.()}
 aria-pressed={isActive}
 className={twMerge(
 "w-full p-6 bg-white border rounded-xl cursor-pointer transition-all duration-200",
 "hover:-translate-y-0.5 hover:shadow-md",
 isActive
 ? "border-slate-200 ring-1 ring-blue-500 bg-slate-50"
 : "border-slate-300",
 )}
 >
 <div className="flex flex-col items-start gap-4">
 <div className="w-12 h-12 bg-blue-50 rounded-lg flex justify-center items-center">
 <Image src={icon} width={24} height={24} alt="" aria-hidden="true" />
 </div>
 <h3 className="max-w-[275.33px] w-full text-[20px] font-semibold text-slate-900">
 {title}
 </h3>
 <p className="max-w-[275.33px] w-full text-[14px] text-slate-900">
 {description}
 </p>
 </div>
 </article>
 );
}
