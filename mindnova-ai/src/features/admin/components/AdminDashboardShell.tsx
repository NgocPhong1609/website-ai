"use client";

import {
 createContext,
 type ReactNode,
 type RefObject,
 useCallback,
 useContext,
 useEffect,
 useMemo,
 useRef,
 useState,
} from "react";

interface AdminDashboardShellProps {
 children: ReactNode;
}

interface AdminNavigationContextValue {
 isOpen: boolean;
 menuButtonRef: RefObject<HTMLButtonElement | null>;
 openNavigation: () => void;
 closeNavigation: () => void;
}

const AdminNavigationContext = createContext<AdminNavigationContextValue | null>(null);

export function useAdminNavigation() {
 const context = useContext(AdminNavigationContext);

 if (!context) {
 throw new Error("Admin navigation controls must be used within AdminDashboardShell.");
 }

 return context;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
 const [isOpen, setIsOpen] = useState(false);
 const menuButtonRef = useRef<HTMLButtonElement>(null);

 const openNavigation = useCallback(() => {
 setIsOpen(true);
 }, []);

 const closeNavigation = useCallback(() => {
 if (!isOpen) return;

 setIsOpen(false);
 menuButtonRef.current?.focus();
 }, [isOpen]);

 useEffect(() => {
 if (!isOpen) return;

 const handleKeyDown = (event: KeyboardEvent) => {
 if (event.key === "Escape") {
 closeNavigation();
 }
 };

 document.addEventListener("keydown", handleKeyDown);
 return () => document.removeEventListener("keydown", handleKeyDown);
 }, [closeNavigation, isOpen]);

 const navigation = useMemo(
 () => ({ isOpen, menuButtonRef, openNavigation, closeNavigation }),
 [closeNavigation, isOpen, openNavigation],
 );

 return (
 <AdminNavigationContext.Provider value={navigation}>
 <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_30%),linear-gradient(180deg,#edf7fb_0%,#eaf1f8_100%)] text-slate-900 [--mn-cyan:#0ea5e9] [--mn-indigo:#C0392B] [--mn-ink:#0b122a] [font-family:var(--font-admin-body)]">
 <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]" />
 <div className="relative mx-auto max-w-[1600px] px-3 py-3 sm:px-5 lg:px-6">
 {children}
 </div>
 </div>
 </AdminNavigationContext.Provider>
 );
}
