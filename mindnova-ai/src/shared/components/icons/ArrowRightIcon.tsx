interface ArrowRightIconProps {
  className?: string;
}

/**
 * A simple right-pointing arrow icon used for navigation/action buttons.
 */
export function ArrowRightIcon({ className = "w-4 h-4" }: ArrowRightIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
