import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { ISkill } from "@/src/features/student/onboarding/types";

interface SkillCardProps extends Omit<ISkill, "id"> {
  onClick?: () => void;
  isActive?: boolean;
}

const LEVEL_BAR_COUNT: Record<ISkill["level"], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export default function SkillCard({
  level,
  description,
  iconPath,
  iconBgColor = "bg-[#E5F6F8]",
  onClick,
  isActive = false,
}: SkillCardProps) {
  const activeBars = LEVEL_BAR_COUNT[level];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-pressed={isActive}
      className={twMerge(
        "w-full bg-white rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300",
        "border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.02)]",
        "hover:-translate-y-1 hover:shadow-md",
        isActive && "border-[#6B6BFF] ring-1 ring-[#6B6BFF] bg-[#F8F9FE]",
      )}
    >
      {/* Icon */}
      <div
        className={twMerge(
          "w-14 h-14 rounded-full flex items-center justify-center mb-6",
          iconBgColor,
        )}
      >
        <Image
          src={iconPath}
          width={24}
          height={24}
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-semibold text-[#131B2E] mb-3">{level}</h3>

      {/* Description */}
      <p className="text-[14px] text-[#464554] leading-relaxed mb-8">
        {description}
      </p>

      {/* Level indicator bars */}
      <div className="flex gap-1.5 mt-auto" aria-label={`Level: ${level}`}>
        {[1, 2, 3].map((barIndex) => (
          <div
            key={barIndex}
            className={twMerge(
              "h-1.5 w-6 rounded-full transition-colors",
              barIndex <= activeBars ? "bg-[#6B6BFF]" : "bg-[#E2E2EA]",
            )}
          />
        ))}
      </div>
    </article>
  );
}
