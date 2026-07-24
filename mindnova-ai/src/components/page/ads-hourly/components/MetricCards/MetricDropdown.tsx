"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import type { MetricKey } from "../../types";
import { ALL_METRIC_KEYS, METRIC_CONFIGS } from "../../constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricDropdownProps {
  /** The metric currently shown on the card */
  activeMetric: MetricKey;
  /** All metrics already occupying other card slots (to show "in use" state) */
  usedMetrics: MetricKey[];
  /** Anchor element — the button that triggered the dropdown */
  anchorEl: HTMLButtonElement | null;
  onSelect: (metric: MetricKey) => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MetricDropdown({
  activeMetric,
  usedMetrics,
  anchorEl,
  onSelect,
  onClose,
}: MetricDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // Position the dropdown below the anchor element
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const DROPDOWN_WIDTH = 196;
    const OFFSET_Y = 6;

    let left = rect.left + window.scrollX;
    // Clamp to viewport
    const rightEdge = left + DROPDOWN_WIDTH;
    if (rightEdge > window.innerWidth - 8) {
      left = window.innerWidth - 8 - DROPDOWN_WIDTH;
    }

    setStyle({
      position: "fixed",
      top: rect.bottom + OFFSET_Y,
      left,
      width: DROPDOWN_WIDTH,
      zIndex: 9999,
    });
  }, [anchorEl]);

  // Close on click outside or Escape
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        e.target !== anchorEl
      ) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorEl, onClose]);

  const handleSelect = useCallback(
    (metric: MetricKey) => {
      onSelect(metric);
      onClose();
    },
    [onSelect, onClose],
  );

  if (!anchorEl) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={style}
      role="listbox"
      aria-label="Select metric"
      className="bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#EAEAF4] py-1.5 overflow-hidden"
    >
      {ALL_METRIC_KEYS.map((key) => {
        const cfg = METRIC_CONFIGS[key];
        const isActive = key === activeMetric;
        const isUsed = usedMetrics.includes(key);

        return (
          <button
            key={key}
            role="option"
            aria-selected={isActive}
            onClick={() => handleSelect(key)}
            className={twMerge(
              "w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors",
              "text-[12.5px] font-semibold text-[#464554]",
              "hover:bg-[#F4F4FD] hover:text-[#1A1A2E]",
              isActive && "bg-[#EEEEFF] text-[#4648D4]",
            )}
          >
            {/* Color dot */}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.label}
            {isUsed && !isActive && (
              <span className="ml-auto text-[10px] font-normal text-[#B0B0C8]">
                in use
              </span>
            )}
            {isActive && (
              <span className="ml-auto text-[#4648D4]">
                {/* Checkmark */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}
