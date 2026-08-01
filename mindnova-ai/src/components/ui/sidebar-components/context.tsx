"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SidebarContextType, SidebarProviderProps } from "./types";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar(): SidebarContextType {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return ctx;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindnova_sidebar_open");
      if (stored !== null) setIsOpen(stored === "true");
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((v: boolean) => {
    try { localStorage.setItem("mindnova_sidebar_open", String(v)); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => { const next = !prev; persist(next); return next; });
  }, [persist]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const setMobileOpen = useCallback((v: boolean) => {
    setIsMobileOpen(v);
  }, []);

  // Ctrl+B / Cmd+B shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        const t = e.target as HTMLElement;
        if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA" && !t.isContentEditable) {
          e.preventDefault();
          toggle();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <SidebarContext.Provider value={{
      isOpen,
      isMobileOpen,
      toggle,
      toggleMobile,
      setMobileOpen,
      // backward-compat
      isCollapsed: !isOpen,
      toggleCollapse: toggle,
      setCollapsed: (v: boolean) => { setIsOpen(!v); persist(!v); },
    }}>
      {children}
    </SidebarContext.Provider>
  );
}
