import Image from "next/image";

export default function HeroSectionRight() {
  return (
    <div className="max-w-135 w-full h-135 relative flex items-start shrink-0">
      <div className="relative overflow-hidden rounded-[80px] bg-white/20 border border-white/40 w-full h-full">
        <Image
          className="object-cover"
          src="/images/computer.png"
          alt="computer"
          fill
          sizes="(max-width: 1024px) 100vw, 540px"
          priority
        />
      </div>
    </div>
  );
}
