import React from "react";
import { twMerge } from "tailwind-merge";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className={twMerge("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={twMerge(
          "animate-spin rounded-full border-gray-200 border-t-indigo-600",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-gray-500 font-medium text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};
