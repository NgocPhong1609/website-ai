import React from "react";
import { twMerge } from "tailwind-merge";
import { SearchX, LucideIcon } from "lucide-react";

export interface NoDataAvailableProps {
  title?: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  image?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

export const NoDataAvailable: React.FC<NoDataAvailableProps> = ({
  title = "Không có dữ liệu",
  description = "Hiện tại chưa có dữ liệu nào để hiển thị trong khu vực này.",
  icon: Icon = SearchX,
  image,
  action,
  className,
  variant = "default",
}) => {
  const isCompact = variant === "compact";

  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center w-full bg-white dark:bg-slate-900",
        isCompact ? "p-4 sm:p-6" : "p-8 sm:p-12",
        "rounded-2xl border border-slate-100 dark:border-slate-800",
        "shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-5">
        {/* Decorative background blur */}
        <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 blur-2xl rounded-full transform scale-150" />
        
        {image ? (
          <img 
            src={image} 
            alt="No data illustration" 
            className={twMerge(
              "relative z-10 object-contain",
              isCompact ? "w-24 h-24" : "w-40 h-40"
            )}
            loading="lazy"
          />
        ) : (
          <div className={twMerge(
            "relative z-10 flex items-center justify-center rounded-full",
            "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400",
            isCompact ? "w-16 h-16" : "w-24 h-24"
          )}>
            <Icon 
              strokeWidth={1.5} 
              className={twMerge(isCompact ? "w-8 h-8" : "w-12 h-12")} 
            />
          </div>
        )}
      </div>

      <div className="text-center z-10 flex flex-col items-center max-w-md">
        <h3 className={twMerge(
          "font-semibold text-slate-900 dark:text-white tracking-tight mb-2",
          isCompact ? "text-base" : "text-xl sm:text-2xl"
        )}>
          {title}
        </h3>
        
        <div className={twMerge(
          "text-slate-500 dark:text-slate-400",
          isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base",
          action ? "mb-6" : "mb-0"
        )}>
          {description}
        </div>

        {action && (
          <div className="mt-2 w-full flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
