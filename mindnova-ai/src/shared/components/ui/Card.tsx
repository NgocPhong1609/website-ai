import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type CardVariant = "default" | "glass" | "gradient" | "outline" | "elevated" | "unstyled";
export type CardHoverEffect = "none" | "lift" | "glow" | "interactive" | "border";
export type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: CardHoverEffect;
  padding?: CardPadding;
  children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white rounded-2xl md:rounded-3xl border border-[#E6E6F0] shadow-2xs text-[#1A1A2E]",
  glass:
    "bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-[#6B6BFF]/25 shadow-sm text-[#1A1A2E]",
  gradient:
    "bg-gradient-to-br from-[#F6F6FB] via-white to-[#EEF2FF] rounded-2xl md:rounded-3xl border border-[#6B6BFF]/20 shadow-[0_8px_30px_rgba(107,107,255,0.06)] text-[#1A1A2E]",
  outline:
    "bg-transparent rounded-2xl md:rounded-3xl border border-[#E6E6F0] text-[#1A1A2E]",
  elevated:
    "bg-white rounded-2xl md:rounded-3xl border border-[#E8E8F2] shadow-[0_12px_36px_rgba(26,26,46,0.07)] text-[#1A1A2E]",
  unstyled: "",
};

const hoverStyles: Record<CardHoverEffect, string> = {
  none: "",
  lift:
    "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(107,107,255,0.12)] hover:border-[#6B6BFF]/60",
  glow:
    "transition-all duration-300 hover:shadow-[0_0_24px_rgba(107,107,255,0.18)] hover:border-[#6B6BFF]",
  interactive:
    "transition-all duration-250 hover:-translate-y-1 hover:border-[#6B6BFF]/80 hover:shadow-[0_12px_32px_rgba(107,107,255,0.1)] cursor-pointer active:translate-y-0",
  border: "transition-colors duration-200 hover:border-[#6B6BFF]",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-7",
  xl: "p-8 sm:p-9",
};

/**
 * Utility helper to generate combined Card classes for components like Next.js <Link> or custom containers.
 */
export function getCardClassName({
  variant = "default",
  hoverEffect = "none",
  padding = "md",
  className = "",
}: {
  variant?: CardVariant;
  hoverEffect?: CardHoverEffect;
  padding?: CardPadding;
  className?: string;
} = {}): string {
  return twMerge(
    "relative overflow-hidden flex flex-col",
    variantStyles[variant],
    hoverStyles[hoverEffect],
    paddingStyles[padding],
    className,
  );
}

/**
 * Reusable flexible Card container for large scale design consistency across MindNova AI.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    children,
    className = "",
    variant = "default",
    hoverEffect = "none",
    padding = "md",
    ...rest
  } = props;

  const combinedClasses = getCardClassName({ variant, hoverEffect, padding, className });

  return (
    <div ref={ref} className={combinedClasses} {...rest}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

// ─── Composable Subcomponents ─────────────────────────────────────────────────

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={twMerge("flex flex-col gap-1.5 pb-4 border-b border-[#F0F0F8] mb-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <h3
      ref={ref}
      className={twMerge("text-lg sm:text-xl font-bold text-[#1A1A2E] tracking-tight leading-snug", className)}
      {...rest}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <p
      ref={ref}
      className={twMerge("text-xs sm:text-sm text-[#64647A] leading-relaxed", className)}
      {...rest}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={twMerge("flex-1", className)} {...rest}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={twMerge("pt-4 mt-4 flex items-center justify-between border-t border-[#F0F0F8]", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export default Card;
