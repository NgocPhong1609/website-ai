import Image from "next/image";
import type { IFeature } from "@/src/components/page/student/onboarding/types";
import { memo } from "react";

type FeatureCardProps = Omit<IFeature, "id">;

export default memo(function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl bg-white/80 backdrop-blur-md border border-[#E2E8F0]/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(107,107,255,0.12)] hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden">
      {/* Top hover accent glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#6B6BFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#4648D4]/10 border border-[#6B6BFF]/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#6B6BFF]/20 transition-all duration-300">
          <Image src={icon} alt="" aria-hidden="true" width={20} height={20} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-[#131B2E] group-hover:text-[#4648D4] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-[11px] text-[#64647A] mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});
