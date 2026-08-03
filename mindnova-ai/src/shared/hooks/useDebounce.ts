import { useEffect, useState } from "react";

/**
 * Custom hook to debounce any rapidly changing value (e.g., filter status, search input).
 * Adheres to checklist Rule #1 by isolating generic state logic outside UI components.
 *
 * @template T - The type of value being debounced
 * @param {T} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds before updating the debounced value (default: 300ms)
 * @returns {T} - The debounced value after the delay
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
