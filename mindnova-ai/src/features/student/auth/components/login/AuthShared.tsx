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

import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export function LogoMark() {
  return <Sparkles size={24} className="text-[#C0392B]" />;
}

export function UserIcon() {
  return <User size={16} />;
}

export function EmailIcon() {
  return <Mail size={16} />;
}

export function LockIcon() {
  return <Lock size={16} />;
}

export function EyeOpenIcon() {
  return <Eye size={16} />;
}

export function EyeClosedIcon() {
  return <EyeOff size={16} />;
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

export function ArrowRightIcon() {
 return <ArrowRight size={16} />;
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
 <label htmlFor={id} className={`text-sm font-semibold ${error ? "text-red-500" : "text-[#2C3039]"}`}>
 {label}
 </label>
 {labelRight}
 </div>
 <div className="relative group">
 <div className={`pointer-events-none absolute inset-y-0 left-4 flex items-center transition-colors duration-200 ${error ? "text-red-400 group-focus-within:text-red-500" : "text-[#B0B0C8] group-focus-within:text-[#C0392B]"}`}>
 {leftIcon}
 </div>
 <input
 id={id}
 className={`w-full pl-11 pr-11 py-3.5 rounded-xl text-sm text-[#2C3039] placeholder-[#C0C0D8] bg-[#F8F8FC] border transition-all duration-200 focus:outline-none focus:bg-white ${error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-red-400" : "border-[#E4E4EF] focus:border-[#E8E2D9] focus:ring-4 focus:ring-[#C0392B]/10 hover:border-[#C8C8E0]"}`}
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
