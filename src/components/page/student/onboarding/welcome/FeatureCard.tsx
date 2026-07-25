import Image from "next/image";
import type { IFeature } from "@/src/components/page/student/onboarding/types";

type FeatureCardProps = Omit<IFeature, "id">;

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="max-w-43.75 w-full rounded-2xl bg-[#F2F3FF]/50 border border-[#C7C4D7]/30 flex flex-col gap-2 p-4">
      <div className="w-10 h-10 rounded-lg bg-[#4648D4]/10 flex justify-center items-center">
        <Image src={icon} alt="" aria-hidden="true" width={16} height={20} />
      </div>
      <h3 className="text-[13px] font-medium text-[#131B2E]">{title}</h3>
      <p className="text-[11px] text-[#464554]">{description}</p>
    </div>
  );
}
