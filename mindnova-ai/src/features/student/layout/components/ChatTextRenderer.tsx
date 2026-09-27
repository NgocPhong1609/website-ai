"use client";

import React, { useState, useRef, useEffect } from "react";

// Lightweight markdown-ish rendering and typing animation for Nova chat bubbles.
export function renderFormattedText(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, lineIndex, lines) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let match;
    let lastIdx = 0;
    let idx = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={`text-${idx++}`}>{line.slice(lastIdx, match.index)}</span>);
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`bold-${idx++}`} className="font-semibold text-blue-600 bg-blue-50/70 px-1.5 py-0.5 rounded-md border border-blue-600/15">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <span key={`italic-${idx++}`} className="font-medium text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded-md border border-emerald-600/15">
            {token.slice(1, -1)}
          </span>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code key={`code-${idx++}`} className="font-mono text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-600/20">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(<span key={`other-${idx++}`}>{token}</span>);
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < line.length) {
      parts.push(<span key={`end-${idx++}`}>{line.slice(lastIdx)}</span>);
    }

    return (
      <React.Fragment key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export function TypewriterText({
  id,
  text,
  animate = false,
  isStopped = false,
  onScroll,
  onTypingStateChange,
}: {
  id?: string;
  text: string;
  animate?: boolean;
  isStopped?: boolean;
  onScroll?: (smooth?: boolean) => void;
  onTypingStateChange?: (typing: boolean) => void;
}) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);
  const onScrollRef = useRef(onScroll);
  const isStoppedRef = useRef(isStopped);
  const onTypingRef = useRef(onTypingStateChange);

  useEffect(() => {
    onScrollRef.current = onScroll;
    isStoppedRef.current = isStopped;
    onTypingRef.current = onTypingStateChange;
  }, [onScroll, isStopped, onTypingStateChange]);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      onTypingRef.current?.(false);
      return;
    }

    onTypingRef.current?.(true);

    let currentIndex = 0;
    const totalLen = text.length;
    let tickCount = 0;

    const timer = setInterval(() => {
      if (isStoppedRef.current) {
        clearInterval(timer);
        setDisplayedText((prev) => prev + " *(Đã bị tạm dừng)*");
        onTypingRef.current?.(false);
        return;
      }

      if (currentIndex < totalLen) {
        // Stream small chunks of characters every 25ms
        const step = Math.floor(Math.random() * 4) + 2;
        currentIndex = Math.min(totalLen, currentIndex + step);
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        clearInterval(timer);
        onTypingRef.current?.(false);
        if (onScrollRef.current) {
          setTimeout(() => onScrollRef.current?.(false), 60);
        }
      }
    }, 25);

    return () => {
      clearInterval(timer);
      onTypingRef.current?.(false);
    };
  }, [text, animate]);

  return <>{renderFormattedText(displayedText)}</>;
}
