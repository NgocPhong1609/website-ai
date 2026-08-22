"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserRole {
  id: number;
  name?: string;
}

export interface AuthUser {
  roles?: UserRole[];
  role?: string | null;
  is_admin?: boolean;
  isAdmin?: boolean;
}

export type NormalizedRole = "admin" | "instructor" | "student";

const ADMIN_ROLE_ALIASES = ["admin", "administrator", "super_admin", "super-admin"];
const INSTRUCTOR_ROLE_ALIASES = ["instructor", "teacher", "lecturer"];

export function normalizeRoleName(roleName: unknown): string {
  if (typeof roleName !== "string") return "";
  return roleName.trim().toLowerCase().replace(/\s+/g, "_");
}

export function resolveUserRole(user: AuthUser): NormalizedRole {
  const roleNames = new Set<string>();

  if (Array.isArray(user.roles)) {
    user.roles.forEach((role) => {
      roleNames.add(normalizeRoleName(role?.name));
    });
  }

  roleNames.add(normalizeRoleName(user.role));

  if (user.is_admin === true || user.isAdmin === true) {
    return "admin";
  }

  const hasAdminRole = ADMIN_ROLE_ALIASES.some((alias) => roleNames.has(alias));
  if (hasAdminRole) {
    return "admin";
  }

  const hasInstructorRole = INSTRUCTOR_ROLE_ALIASES.some((alias) => roleNames.has(alias));
  if (hasInstructorRole) {
    return "instructor";
  }

  return "student";
}

export function getRedirectPathFromRole(role: NormalizedRole): string {
  if (role === "admin") return "/admin";
  if (role === "instructor") return "/instructor";
  return "/explore";
}

export const getUserRoleStr = (input: any): NormalizedRole => {
  if (!input) return "student";
  if (Array.isArray(input)) {
    return resolveUserRole({ roles: input });
  }
  if (typeof input === "object") {
    return resolveUserRole(input);
  }
  return "student";
};

export const getRedirectPath = (input: any): string => {
  const roleStr = getUserRoleStr(input);
  return getRedirectPathFromRole(roleStr);
};

// ─── Icons ────────────────────────────────────────────────────────────────────

export function LogoMark() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_6px_20px_rgba(107,107,255,0.5)]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="2.8" fill="white" />
        <path
          d="M12 2v3.5M12 18.5V22M4.22 4.22l2.47 2.47M17.31 17.31l2.47 2.47M2 12h3.5M18.5 12H22M4.22 19.78l2.47-2.47M17.31 6.69l2.47-2.47"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function EyeOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeClosedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Reusable Input ───────────────────────────────────────────────────────────

export interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  leftIcon: React.ReactNode;
  rightElement?: React.ReactNode;
  labelRight?: React.ReactNode;
  error?: string;
}

export function FormField({ id, label, leftIcon, rightElement, labelRight, error, ...inputProps }: StyledInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={`text-sm font-semibold ${error ? "text-red-500" : "text-[#1A1A2E]"}`}>
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative group">
        <div className={`pointer-events-none absolute inset-y-0 left-4 flex items-center transition-colors duration-200 ${error ? "text-red-400 group-focus-within:text-red-500" : "text-[#B0B0C8] group-focus-within:text-[#6B6BFF]"}`}>
          {leftIcon}
        </div>
        <input
          id={id}
          className={`w-full pl-11 pr-11 py-3.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#C0C0D8] bg-[#F8F8FC] border transition-all duration-200 focus:outline-none focus:bg-white ${error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-red-400" : "border-[#E4E4EF] focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 hover:border-[#C8C8E0]"}`}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
    </div>
  );
}
