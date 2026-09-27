import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge("animate-pulse rounded-lg bg-slate-200", className)}
      {...props}
    />
  );
}

/** Wrapper that announces a loading region to assistive tech. */
function SkeletonRegion({ className, children, label = "Đang tải" }: { className?: string; children: React.ReactNode; label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={twMerge("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={twMerge("h-4", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={twMerge("bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={lines} />
    </div>
  );
}

export function SkeletonStatGrid({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <SkeletonRegion className={twMerge("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className, withHeader = true }: { rows?: number; cols?: number; className?: string; withHeader?: boolean }) {
  return (
    <SkeletonRegion className={twMerge("w-full", className)}>
      {withHeader && (
        <div className="flex gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1 max-w-32" />
          ))}
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-5 py-4">
            {Array.from({ length: cols }).map((_, c) =>
              c === 0 ? (
                <div key={c} className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ) : (
                <Skeleton key={c} className="h-3.5 flex-1" />
              )
            )}
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function SkeletonList({ items = 4, className, withAvatar = true }: { items?: number; className?: string; withAvatar?: boolean }) {
  return (
    <SkeletonRegion className={twMerge("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
          {withAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function SkeletonPage({ className, children }: { className?: string; children: React.ReactNode }) {
  return <SkeletonRegion className={className}>{children}</SkeletonRegion>;
}
