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
 return (<></>);
}

export function UserIcon() {
 return (
 <></>
 );
}

export function EmailIcon() {
 return (
 <></>
 );
}

export function LockIcon() {
 return (
 <></>
 );
}

export function EyeOpenIcon() {
 return (
 <></>
 );
}

export function EyeClosedIcon() {
 return (
 <></>
 );
}

export function GoogleIcon() {
 return (
 <></>
 );
}

export function ArrowRightIcon() {
 return (
 <></>
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
